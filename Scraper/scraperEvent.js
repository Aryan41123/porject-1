const axios = require("axios");

const scrapeEvents = async () => {
  const url = "https://www.eventbrite.com.au/d/australia--sydney/events/";

  try {
    const { data } = await axios.get(url);

    const matches = [...data.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)];

    for (const match of matches) {
      try {
        const json = JSON.parse(match[1].trim());

        if (json.itemListElement) {
          const events = json.itemListElement.map(item => {
            const e = item.item;
            return {
              title: e.name,
              date: e.startDate,
              link: e.url,
              image: e.image,
              location: e.location?.name || "",
            };
          });

          return events;
        }
      } catch (err) {
        continue;
      }
    }

    return [];
  } catch (err) {
    console.error("Error scraping Eventbrite:", err.message);
    return [];
  }
};

module.exports = scrapeEvents;
