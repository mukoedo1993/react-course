Solution to Common Database Problem
Many of you have had trouble getting the backend to run, and nearly all of those issues are related to your database connection string. When you chose the password for your Atlas dbUser is it possible you used a password generator tool that included special characters? That will cause your DB connection string to fail. You can use a password like that, but you need to make sure the password included in your connection string is url-encoded. You can use [this tool](https://meyerweb.com/eric/tools/dencoder/) to encode and decode the password portion of your connection string. Or, if that sounds too complicated, you can try giving your Atlas dbUser a new password that uses simple characters and numbers and then update your connection string accordingly.

Thanks!
Brad
