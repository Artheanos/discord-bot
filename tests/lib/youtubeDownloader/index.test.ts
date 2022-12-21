import * as fs from 'fs'

import { FriendlyError } from '../../../src/FriendlyError'
import { downloadTrack } from '../../../src/lib/youtubeDownloader'
import { resolve, join } from 'path'

jest.setTimeout(10_000)

describe('Downloading song', () => {

    describe('when url is invalid', () => {
        describe('invalid url', () => {
            it('returns 404', async () => {
                await expect(downloadTrack('https://youtube.com/dusko')).rejects.toEqual(new FriendlyError('notFound'))
            })
        })

        describe('invalid videoId', () => {
            it('returns Video unavailable', async () => {
                await expect(downloadTrack('https://www.youtube.com/watch?v=ZZ3bYfUEWixI')).rejects.toEqual(new FriendlyError('unavailable'))
            })
        })
    })

    describe('when url is valid', () => {
        const expectedDestination = resolve(join(__dirname, '../../../src/lib/youtubeDownloader/cache/5DlROhT8NgU_AMOGUS.opus'))

        it('downloads the song', async () => {
            try {
                await fs.unlinkSync(expectedDestination)
            } catch (e) {
            }
            expect(await downloadTrack('https://www.youtube.com/watch?v=5DlROhT8NgU')).toEqual(expectedDestination)
        })

        it('does not call exec and returns in under 10ms', async () => {
            expect(await downloadTrack('https://www.youtube.com/watch?v=5DlROhT8NgU')).toEqual(expectedDestination)
        }, 10)
    })
})
