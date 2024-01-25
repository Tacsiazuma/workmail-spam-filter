import Classifier from "../src/function/classifier"

describe('classifier', () => {
    let underTest = new Classifier()
    describe('spam', () => {
        it('should recognize', async () => {
            await underTest.train(["spam text", "100% growth", "free money"], true)
            await underTest.train(["AWS bills", "Tech newsletter"], false)
            const isSpam = await underTest.isSpam("AWS 100% free money")
            expect(isSpam).toBe(true)
        })
        it('detection should be case insensitive', async () => {
            await underTest.train(["spam text", "100% growth", "free money"], true)
            await underTest.train(["AWS bills", "Tech newsletter"], false)
            const isSpam = await underTest.isSpam("aws 100% FREE MONEY")
            expect(isSpam).toBe(true)
        })
    })
    describe('non-spam', () => {
        it('should recognize', async () => {
            await underTest.train(["spam text", "100% growth", "free money"], true)
            await underTest.train(["AWS bills", "Tech newsletter"], false)
            const isSpam = await underTest.isSpam("Free AWS newsletter")
            expect(isSpam).toBe(false)
        })
        it('detection should be case insensitive', async () => {
            await underTest.train(["spam text", "100% growth", "free money"], true)
            await underTest.train(["AWS bills", "Tech newsletter"], false)
            const isSpam = await underTest.isSpam("FREE AWS NEWSLETTER")
            expect(isSpam).toBe(false)
        })
        it('non trained words should fall into', async () => {
            await underTest.train(["spam text", "100% growth", "free money"], true)
            const isSpam = await underTest.isSpam("AWS newsletter")
            expect(isSpam).toBe(false)
        })
    })
})
