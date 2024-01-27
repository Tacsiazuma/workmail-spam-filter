import Classifier from '../src/function/classifier';
import { SpamFilter } from '../src/function/spamfilter'
import { createMimeMessage } from 'mimetext'

describe('spamfilter', () => {
    let spamfilter: SpamFilter;
    describe('w/o classifier', () => {
        beforeEach(() => {
            spamfilter = SpamFilter.create()
        })
        it('should fail if empty mime-text given', async () => {
            try {
                await spamfilter.isSpam("")
                fail()
            } catch (err) {
                expect(err.message).toBe("mimeText cannot be empty")
            }
        })
        it('should categorize as spam if no subject', async () => {
            const message = createMessage()
            message.setSubject('')
            const isSpam = await spamfilter.isSpam(message.asRaw())
            expect(isSpam).toBe(true)
        })

        it('should categorize as spam if body only contains an image', async () => {
            const message = createMessage()
            message.addMessage({ contentType: 'text/plain', data: '' })
            message.addMessage({ contentType: 'text/html', data: '<img src="cid:dots123456">' })
            message.addAttachment({
                inline: true,
                filename: 'dots.jpg',
                contentType: 'image/jpg',
                data: '...base64 encoded data...',
                headers: { 'Content-ID': 'dots123456' }
            })
            const isSpam = await spamfilter.isSpam(message.asRaw())
            expect(isSpam).toBe(true)
        })

        it('should not categorize as spam if classifier not configured', async () => {
            const message = createMessage()
            const isSpam = await spamfilter.isSpam(message.asRaw())
            expect(isSpam).toBe(false)
        })
    })
    describe('w/ classifier', () => {
        beforeEach(() => {
            const classifier = new Classifier
            classifier.train(["bitcoin 100%"], true)
            classifier.train(["friend soy home"], false)
            spamfilter = SpamFilter.create(classifier)
        })
        it('should categorize as spam if subject looks spam', async () => {
            const message = createMessage()
            message.setSubject('100% bitcoin gain')
            const isSpam = await spamfilter.isSpam(message.asRaw())
            expect(isSpam).toBe(true)
        })

        it('should categorize as spam if body looks spam', async () => {
            const message = createMessage()
            message.addMessage({ contentType: 'text/plain', data: 'bitcoin gain 100%' })
            const isSpam = await spamfilter.isSpam(message.asRaw())
            expect(isSpam).toBe(true)
        })

        it('should not categorize as spam if nothing looks spam', async () => {
            const message = createMessage()
            message.setSubject('dear friend')
            message.addMessage({ contentType: 'text/plain', data: 'long time no sea' })
            const isSpam = await spamfilter.isSpam(message.asRaw())
            expect(isSpam).toBe(false)
        })
    })
})
function createMessage() {
    const message = createMimeMessage()
    message.setSender({ name: 'Someone', addr: 'test@example.com' })
    message.setRecipient('you@example.com')
    message.setSubject('some subject')
    message.addMessage({ contentType: 'text/plain', data: 'hey' })
    return message
}
