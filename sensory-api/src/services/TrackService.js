const Tracker = require("../models/Tracker")
const fs = require("fs").promises
const cron = require("node-cron")
const crypto = require("crypto")
const { diff } = require("deep-diff")
const axios = require("axios")
const puppeteer = require("puppeteer")
const hashFile = "./hash.txt"
const contentFile = "./content.txt"
const url = "https://shohinsan.github.io/"

async function computeHash(content) {
  return crypto.createHash("sha256").update(content).digest("hex")
}

async function storeHashAndContent(hash, content) {
  await fs.writeFile(hashFile, hash)
  await fs.writeFile(contentFile, content)
}

async function fetchWebsiteContent(url) {
  try {
    const response = await axios.get(url)
    const newHash = await computeHash(response.data)
    return [newHash, response.data]
  } catch (error) {
    console.error("Error fetching the website:", error)
    return null
  }
}

async function updateDatabase(
  url,
  isUp,
  responseTime,
  loadTime,
  networkActivity,
  cookies
) {
  try {
    const tracker = await Tracker.findOne({ url })
    if (tracker) {
      tracker.isUp = isUp
      tracker.timestamp = new Date()
      tracker.responseTime = responseTime
      tracker.loadTime = loadTime
      tracker.networkActivity = networkActivity
      tracker.cookies = cookies
      await tracker.save()
    } else {
      await Tracker.create({
        url,
        isUp,
        timestamp: new Date(),
        responseTime,
        loadTime,
        networkActivity,
        cookies,
      })
    }
  } catch (error) {
    console.error(`Error updating database for ${url}: ${error.message}`)
  }
}

class TrackService {
  static async trackStatusCode(req, res) {
    try {
      const { statusCode } = req
      const trackData = {
        statusCode,
        timestamp: new Date(),
      }
      const newRecord = await Tracker.create(trackData)
      console.log("Record saved to database:", newRecord)
      res.status(200).json(newRecord)
    } catch (error) {
      console.error(error)
      res.status(500).send("Internal Server Error")
    }
  }

  static async rikaFunction() {
    try {
      const storedHash = await fs.readFile(hashFile, "utf8")
      const storedContent = await fs.readFile(contentFile, "utf8")

      const [newHash, newContent] = await fetchWebsiteContent(url)

      await storeHashAndContent(newHash, newContent)

      console.log(newHash)
      console.log(newContent)
      if (storedHash && newHash !== storedHash) {
        console.log("Content has changed.")
        const differences = diff(storedContent, newContent) // Detailed difference
        if (differences) {
          console.log("Differences:", differences)
        }
      } else {
        console.log("No changes detected.")
      }
    } catch (error) {
      console.error("Error during check:", error)
    }
  }

  static async checkUptime(url, additionalVariable) {
    try {
      const response = await axios.get(url)
      const isUp = true // Adjust this logic based on the response
      await updateDatabase(
        url,
        isUp,
        null,
        null,
        null,
        null,
        additionalVariable
      )
    } catch (error) {
      const isUp = false // Adjust this logic based on the error
      await updateDatabase(
        url,
        isUp,
        null,
        null,
        null,
        null,
        additionalVariable
      )
    }
  }

  static async checkResponseTime() {
    const start = new Date()
    try {
      const response = await axios.get(url)
      const end = new Date()
      const responseTime = end - start // Response time in milliseconds
      await updateDatabase(url, true, responseTime, null, null, null)
      console.log(
        `${new Date().toISOString()} - Response time for ${url}: ${responseTime} ms`
      )
    } catch (error) {
      console.error(`Error checking response time for ${url}`)
      await updateDatabase(url, false, null, null, null, null)
      // Handle error here
    }
  }

  static async checkLoadTime() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    const start = new Date()
    await page.goto(url, { waitUntil: "load" })
    const end = new Date()

    const loadTime = end - start // Load time in milliseconds
    console.log(
      `${new Date().toISOString()} - Load time for ${url}: ${loadTime} ms`
    )
    await updateDatabase(url, true, null, loadTime, null, null)
    await browser.close()
  }

  static async checkNetworkActivity() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    // Capture all network requests and responses
    page.on("request", (request) => {
      console.log(`Request: ${request.url()}`)
      // Record the request details here
    })

    page.on("response", (response) => {
      console.log(`Response: ${response.url()} - Status: ${response.status()}`)
      // Record the response details here
    })

    await page.goto(url, { waitUntil: "networkidle2" })
    await browser.close()
  }

  static async getCookies() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    const cookies = await page.cookies()
    console.log(`Cookies for ${url}:`, cookies)
    // Record the cookies here
    await browser.close()
  }

  static async checkForChanges() {
    try {
      const storedHash = fs.readFileSync(hashFile, "utf8")
      const storedContent = fs.readFileSync(contentFile, "utf8")

      const [newHash, newContent] = await fetchWebsiteContent(url)

      await storeHashAndContent(newHash, newContent)

      if (storedHash && newHash !== storedHash) {
        console.log("Content has changed.")

        const oldLines = storedContent.split("\n")
        const newLines = newContent.split("\n")

        oldLines.forEach((line, index) => {
          if (line !== newLines[index]) {
            console.log(`Line ${index + 1} changed:`)
            console.log(`- Old: ${line}`)
            console.log(`+ New: ${newLines[index]}`)
          }
        })
      } else {
        console.log("No changes detected.")
      }
    } catch (error) {
      console.error("Error during check:", error)
    }
  }
}

cron.schedule("*/10 * * * *", async () => {
  await TrackService.rikaFunction()
  await TrackService.checkUptime()
  await TrackService.checkResponseTime()
  await TrackService.checkNetworkActivity()
  await TrackService.getCookies()
  await TrackService.checkLoadTime()
})

module.exports = TrackService
