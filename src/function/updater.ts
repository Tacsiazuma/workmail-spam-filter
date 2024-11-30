const MARK_AS_JUNK_BUTTON = "<a href='#junk'>junk</a>"
const MARK_AS_NOT_JUNK_BUTTON = "<a href='#not_junk'>not_junk</a>"
export default class {
    update(content: string, junk: boolean): string {
        return content + junk ? MARK_AS_NOT_JUNK_BUTTON : MARK_AS_JUNK_BUTTON
    }
}
