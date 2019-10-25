// Create connection to database
exports.config =
{
    authentication: {
        options: {
            userName: 'fbadmin', // update me
            password: 'P@ssw0rd' // update me
        },
        type: 'default'
    },
    server: 'demofb.database.windows.net', // update me
    options:
    {
        database: 'demo', //update me
        encrypt: true
    }
}