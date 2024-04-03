function convertToCSV(data) {

  const headersSet = new Set();
    data.forEach(doc => {
      Object.keys(doc).forEach(key => {
        if ((key !== '_id') && (key != 'metrics')) {
          headersSet.add(key);
        }
      });
      // Include keys from metrics object
      if (doc.metrics) {
        Object.keys(doc.metrics).forEach(metricKey => {
          headersSet.add(metricKey);
        });
      }
    });
    const headers = Array.from(headersSet);

    // Convert documents to CSV format
    let csvData = '';

    // Append CSV header
    csvData += headers.join(',') + '\n';

    // Append CSV rows
    data.forEach(doc => {
      const row = [];
      headers.forEach(header => {
        if (header in doc) {
          if (typeof doc[header] === 'object') {
            if (header === 'timestamp') {
              row.push(doc[header].$numberDouble);
            }
          } else {
            row.push(doc[header]);
          }
        } else if (header in doc.metrics) {
          row.push(doc.metrics[header]);
        } else {
          row.push(''); // if the header doesn't exist in the document or metrics, add an empty string
        }
      });

      // Construct CSV row
      csvData += row.join(',') + '\n';
    });
    return csvData;
}

module.exports = {convertToCSV};