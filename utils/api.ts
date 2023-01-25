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
      // create object from rows with key as first column and value as second column for only first 3 rows
      rows.slice(0, 3).forEach((row) => {
        data[row[0]] = row[1];
      });

      // remove the first 20 rows and then make an array of all remaining column 1 cells
      const quotes = rows.slice(20).map((row: string[]) => row[0]);
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

  return [];
}
