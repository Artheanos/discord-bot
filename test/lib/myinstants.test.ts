import axios from "axios"
import { findMp3Paths } from "../../src/lib/myinstants"
import * as fs from "fs"

jest.mock("axios")
const mockedAxios = axios as jest.Mocked<typeof axios>

describe("findMp3s", () => {
    it("finds mp3s", async () => {
        mockedAxios.get.mockResolvedValueOnce({ data: fs.readFileSync("./test/fixtures/myinstants-1.html").toString() })

        const result = await findMp3Paths("dupa")
        expect(result).toEqual(expectedMp3s)
    })
})

const expectedMp3s = [
    "/media/sounds/szatanie-moja-dupa.mp3",
    "/media/sounds/gdzie-jest-dupa.mp3",
    "/media/sounds/odupadupadupa.mp3",
    "/media/sounds/marinette-dupain-cheng-lucky-charm.mp3",
    "/media/sounds/marinette-dupain-cheng-miraculous.mp3",
    "/media/sounds/flecma.mp3",
    "/media/sounds/jedna-poda-dupa-mniej.mp3",
    "/media/sounds/dupa_iRIFUWQ.mp3",
]
