import { google } from "googleapis";

export async function getSheetsData() {
  try {
    const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
    const jwt = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      // @ts-ignore
      null,
      // we need to replace the escaped newline characters
      // https://stackoverflow.com/questions/50299329/node-js-firebase-service-account-private-key-wont-parse
      process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes
    );

    const sheets = google.sheets({ version: "v4", auth: jwt });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Sheet1",
    });
    const rows = response.data.values;
    const data: Record<string, string> = {};
    if (rows?.length) {
      // create object from rows with key as first column and value as second column for the first 20 rows skipping empty values
      rows.slice(0, 19).forEach((row) => {
        if (row[0] && row[1]) {
          data[row[0]] = row[1];
        }
      });

      // remove the first 20 rows and then make an array of all remaining column 1 cells
      const quotes: string[] = [];
      rows.slice(20).forEach((row: string[]) => {
        if (row[0]) {
          quotes.push(row[0]);
        }
      });
      const dataToReturn = {
        ...data,
        quotes: [...quotes],
      };
      // console.log(dataToReturn);
      return dataToReturn;
    }
  } catch (err) {
    console.log(err);
  }

  return {
    title: "North Country Cooling",
    subTitle: "",
    mainContent1: "",
    mainContent2: "",
    callMe: "",
    facebookPost: "",
    quotes: []
  };
}

export async function getLinksData() {
  try {
    const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
    const jwt = new google.auth.JWT(
      process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      // @ts-ignore
      null,
      // we need to replace the escaped newline characters
      // https://stackoverflow.com/questions/50299329/node-js-firebase-service-account-private-key-wont-parse
      process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes
    );

    const sheets = google.sheets({ version: "v4", auth: jwt });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Sheet1",
    });
    const rows = response.data.values;
    if (rows?.length) {
      const links: string[] = [];
      // remove the first 20 rows and then make an array of all remaining column 1 cells
      rows.slice(20).forEach((row: string[]) => {
        if (row[1]) {
          links.push(row[1]);
        }
      });
      const dataToReturn = [...links];

      // console.log(dataToReturn);
      return dataToReturn;
    }
  } catch (err) {
    console.log(err);
  }

  return [];
}
