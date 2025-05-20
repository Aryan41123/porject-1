const axios = require("axios");
const cheerio = require("cheerio");

const scrapeEvents = async () => {
  const url = "https://www.eventbrite.com.au/d/australia--sydney/events/";

  try {
    const { data } = await axios.get(url);

    // Extract embedded JSON-LD structured data
    const match = data.match(/<script type="application\/ld\+json">(.+?)<\/script>/s);
    if (!match || !match[1]) return [];

    const jsonText = match[1].trim();
    const parsed = JSON.parse(jsonText);

    const events = parsed.itemListElement?.map((item) => {
      const e = item.item;
      return {
        title: e.name,
        date: e.startDate,
        link: e.url,
        image: e.image,
        location: e.location?.name,
      };
    }) ?? [];

    return events;
  } catch (err) {
    console.error("Error scraping Eventbrite:", err.message);
    return [];
  }
};

module.exports = scrapeEvents;
