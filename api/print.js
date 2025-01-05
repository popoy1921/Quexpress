// /api/print.js

export default async function handler(req, res) {
  // Check if the request method is GET
  if (req.method === 'GET') {
    const { text1, text2, text3 } = req.query;
  
    const jsonObject = {
        printContent1:
        {
        type: 0, 
        content: text1, 
        bold: 1, 
        align: 1, 
        format: 0 
        },
        printContent2:
        {
        type: 0, 
        content: text2, 
        bold: 1, 
        align: 1, 
        format: 2 
        },
        printContent3:
        {
        type: 0, 
        content: "", 
        bold: 0, 
        align: 1, 
        format: 0 
        },
        printContent4:
        {
        type: 0, 
        content: text3, 
        bold: 0, 
        align: 1, 
        format: 0 
        }
    };

    console.log('Sending JSON response:', JSON.stringify(jsonObject));
    res.json(jsonObject);
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}