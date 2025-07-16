Skip to content
Search
Search
/
Ask AI
Last 20
Last 20 sandbox
Get started
Payments
Revenue
Platforms and marketplaces
Money management
Developer resources

APIs & SDKs

Help

Front end & back end:

React

Next.js

Vue.js

HTML
Onboard accounts to your Connect platform
View the text-based guide
Create a connected account and collect information from it to enable payments.

Download full app
Don't code? Use Stripe’s no-code options or get help from our partners.
1
Select properties
Overview
Your Connect integration changes significantly based on how you create your connected accounts. Making choices here shows how creating and onboarding accounts changes.

See Design an integration to learn more about making these choices.

Server
Choose how your connected accounts onboard to Stripe
Your choice of onboarding method affects the availability of other account options below.

Onboarding:

Hosted

Embedded

API
Redirect your connected accounts to Stripe-hosted onboarding using an Account Link.

Server
Choose where your connected accounts manage their payments and account details
Dashboard access:

Stripe

Express

None
Give your connected accounts access to the Stripe Dashboard.

Server
Choose your charge type
Charge type:

Direct

Destination

Separate charges and transfers
Create destination charges on your platform account, transferring money to your connected accounts.

Server
Choose who pays fees
Who pays fees:

Your connected accounts

Your platform
Stripe takes Stripe fees from your platform. Your platform can monetise payments using application fees.

Server
Choose who is liable for negative balances
Negative balance liability:

Stripe

Platform
Your platform is liable for negative account balances. Stripe is responsible for collecting updated information when requirements are due or change.

Before creating accounts with this setup, carefully consider and acknowledge your platform responsibilities for negative balance liabilities.

Server
2
Set up dependencies
Install the Stripe library
Install the packages and import them in your code. Alternatively, if you’re starting from scratch and need a package.json file, download the project files using the link in the code editor.

Install the libraries, and initialise the Stripe SDK with the correct beta headers:

npm install --save stripe@13.4.0

Server
Set environment variables
Add your secret key to a .env file. Next.js automatically loads it into your application as environment variables.

Server
Add your platform branding
To use Stripe-hosted onboarding, first go to your onboarding settings and customise your branding. You need to set a business name, icon, and brand colour.

Server
3
Create a connected account
Add an endpoint for creating a connected account
Set up an endpoint on your server for your client to call to handle creating a connected account.

Server
Create a connected account
Create a connected account by calling the Stripe API. We’ve configured the attributes used based on the preferences you’ve selected above. You can pre-fill verification information, the business profile of the user, and other fields on the account if your platform has already collected it.

Server
Call the endpoint to create a connected account
Call the endpoint you added above to create a connected account.

Client
4
Onboard the connected account
Overview
As per your preference selection, you selected Stripe-hosted onboarding. Your platform redirects your connected accounts to a Stripe-hosted, co-branded onboarding interface using an Account Link.

Server
Create an Account Links endpoint
Add an endpoint on your server to create an Account Link.

Server
Provide a return URL

settings
When your connected account completes the onboarding flow, it redirects them to the return URL. That doesn’t mean that all information has been collected or that the connected account has no outstanding requirements. It only means that they entered and exited the flow properly.

Server
Provide a refresh URL
Stripe redirects your connected account to the refresh URL when the link is expired, the link has already been visited, your platform can’t access the connected account, or the account is rejected. Get the refresh URL to create a new onboarding Account Link and redirect your user to it.

Server
Call the endpoint to create an Account link
Provide the connected account ID.

Client
Redirect the user to the URL
Send the user to Stripe to complete onboarding. They’re redirected back to your app when onboarding is complete.

Client
Handle the connected account returning
Show the connected account a useful page when they exit the Stripe-hosted onboarding flow.

Client
Handle the Account Link refreshing
Call your endpoint for refreshing the Account Link at the refresh URL.

Client
5
Next steps
Accept payments
Now that you have onboarded a connected account, continue to create destination charges.

Server
Was this page helpful?
Yes
No

pages/index.jsx

pages/refresh/[id].jsx

pages/return/[id].jsx

pages/api/account.js

pages/api/account_link.js

pages/\_app.jsx

lib/utils.js

.env

Download
import { stripe } from "../../lib/utils";

export default async function handler(req, res) {
if (req.method === "POST") {
try {
const { account } = req.body;

      const accountLink = await stripe.accountLinks.create({
        account: account,
        refresh_url: `${req.headers.origin}/refresh/${account}`,
        return_url: `${req.headers.origin}/return/${account}`,
        type: "account_onboarding",
      });

      res.json({
        url: accountLink.url,
      });
    } catch (error) {
      console.error(
        "An error occurred when calling the Stripe API to create an account link:",
        error
      );
      res.status(500);
      res.send({ error: error.message });
    }

}
}

Copy
