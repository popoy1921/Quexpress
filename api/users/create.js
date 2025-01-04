
// /users/create API

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { firstName, lastName, access, email, password, userRole } = req.body;

        // Insert new user into the table using Supabase
        const { data, error } = await supabase
        .from('tbl_quexpress_users') // Replace with your table name
        .insert([
            {
            user_name: email,
            user_pass: password,
            access_id: access,
            user_first_name: firstName,
            user_last_name: lastName,
            window_id: userRole, // Assuming `userRole` maps to `window_id`
            },
        ])
        .select(); // Return the inserted row
    
        if (error) {
            console.error('Error creating user:', error);
            return res.status(400).json({ error: error.message });
        }
        res.status(200).json({ message: 'Data received', data });
    } else {
        // Handle any other HTTP method
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}