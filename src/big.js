const {BigQuery} = require('@google-cloud/bigquery');
const bigquery = new BigQuery();

async function query() {

    const query = `SELECT COUNT(dealer_id)
      FROM \`jmg-data-platform.jmgenius.campaign\`
      WHERE dealer_id != 0
      LIMIT 1`;
  
    //all options: https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
    const options = {
      query: query,
      location: 'US',
    };
  
    // Run the query as a job
    const [job] = await bigquery.createQueryJob(options);
    console.log(`Job ${job.id} started.`);
  
    // Wait for the query to finish
    const [rows] = await job.getQueryResults();
    console.log(rows)
    return rows
  }


module.exports.query = query