
// /customer/create API

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const userDetails = req.body;
        res.json(userDetails);
        // const { accountId, firstName, lastName, mobileNumber } = userDetails;

        // // Insert a new customer record into the `tbl_quexpress_customers` table
        // const { data, error } = await supabase
        // .from('tbl_quexpress_customers')
        // .insert([
        //     {
        //     account_id: accountId,
        //     customer_first_name: firstName,
        //     customer_last_name: lastName,
        //     customer_number: mobileNumber,
        //     enabled_datetime: new Date().toISOString().split('T')[0] // Sets the current date in YYYY-MM-DD format
        //     }
        // ])
        // .select('*'); // Selects the inserted record

        // if (error) {
        //     throw error;
        // }
        // res.json(data[0]);
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}