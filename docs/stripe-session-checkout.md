# Create direct charges

Create charges directly on the connected account and collect fees.

Create _direct charges_ when customers transact directly with a connected account, often unaware of your platform’s existence. With direct charges:

- The payment appears as a charge on the connected account, not your platform’s account.
- The connected account’s balance increases with every charge.
- Your account balance increases with application fees from every charge.

This charge type is best suited for platforms providing software as a service. For example, Shopify provides tools for building online storefronts, and Thinkific enables educators to sell online courses.

Redirect to a Stripe-hosted payment page using [Stripe Checkout](https://docs.stripe.com/payments/checkout.md).
See how this integration [compares to Stripe’s other integration types](https://docs.stripe.com/payments/online-payments.md#compare-features-and-availability).

Redirect to Stripe-hosted payment page

- 20 preset fonts
- 3 preset border radius
- Custom background and border color
- Custom logo

Try it out

Use our official libraries to access the Stripe API from your application:

```bash
\# Available as a gem
sudo gem install stripe
```

```ruby
\# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

```bash
\# Install through pip
pip3 install --upgrade stripe
```

```bash
\# Or find the Stripe package on http://pypi.python.org/pypi/stripe/
```

```python
\# Find the version you want to pin:
# https://github.com/stripe/stripe-python/blob/master/CHANGELOG.md
# Specify that version in your requirements.txt file
stripe>=5.0.0
```

```bash
\# Install the PHP library with Composer
composer require stripe/stripe-php
```

```bash
\# Or download the source directly: https://github.com/stripe/stripe-php/releases
```

```java
/*
  For Gradle, add the following dependency to your build.gradle and replace with
  the version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
*/
implementation "com.stripe:stripe-java:29.0.0"
```

```xml
<!--
  For Maven, add the following dependency to your POM and replace with the
  version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
-->
<dependency>
  <groupId>com.stripe</groupId>
  <artifactId>stripe-java</artifactId>
  <version>29.0.0</version>
</dependency>
```

```bash
\# For other environments, manually install the following JARs:
# - The Stripe JAR from https://github.com/stripe/stripe-java/releases/latest
# - Google Gson from https://github.com/google/gson
```

```bash
\# Install with npm
npm install stripe --save
```

```bash
\# Make sure your project is using Go Modules
go mod init
# Install stripe-go
go get -u github.com/stripe/stripe-go/v82
```

```go
// Then import the package
import (
  "github.com/stripe/stripe-go/v82"
)
```

```bash
\# Install with dotnet
dotnet add package Stripe.net
dotnet restore
```

```bash
\# Or install with NuGet
Install-Package Stripe.net
```

## Create a Checkout Session

A [Checkout Session](https://docs.stripe.com/api/checkout/sessions.md) controls what your customer sees in the payment form such as line items, the order amount, and currency. Add a checkout button to your website that calls a server-side endpoint to create a Checkout Session.

```html
<html>
  <head>
    <title>Checkout</title>
  </head>
  <body>
    <form action="/create-checkout-session" method="POST">
      <button type="submit">Checkout</button>
    </form>
  </body>
</html>
```

On your server, create a Checkout Session and redirect your customer to the [URL](https://docs.stripe.com/api/checkout/sessions/object.md#checkout_session_object-url) returned in the response.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new Stripe.Checkout.SessionCreateOptions
{
    LineItems = new List<Stripe.Checkout.SessionLineItemOptions>
    {
        new Stripe.Checkout.SessionLineItemOptions
        {
            PriceData = new Stripe.Checkout.SessionLineItemPriceDataOptions
            {
                Currency = "usd",
                ProductData = new Stripe.Checkout.SessionLineItemPriceDataProductDataOptions
                {
                    Name = "T-shirt",
                },
                UnitAmount = 1000,
            },
            Quantity = 1,
        },
    },
    PaymentIntentData = new Stripe.Checkout.SessionPaymentIntentDataOptions
    {
        ApplicationFeeAmount = 123,
    },
    Mode = "payment",
    SuccessUrl = "https://example.com/success?session_id={CHECKOUT_SESSION_ID}",
};
var service = new Stripe.Checkout.SessionService();
Stripe.Checkout.Session session = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CheckoutSessionParams{
  LineItems: []*stripe.CheckoutSessionLineItemParams{
    &stripe.CheckoutSessionLineItemParams{
      PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
        Currency: stripe.String(string(stripe.CurrencyUSD)),
        ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
          Name: stripe.String("T-shirt"),
        },
        UnitAmount: stripe.Int64(1000),
      },
      Quantity: stripe.Int64(1),
    },
  },
  PaymentIntentData: &stripe.CheckoutSessionPaymentIntentDataParams{
    ApplicationFeeAmount: stripe.Int64(123),
  },
  Mode: stripe.String(string(stripe.CheckoutSessionModePayment)),
  SuccessURL: stripe.String("https://example.com/success?session_id={CHECKOUT_SESSION_ID}"),
};
result, err := session.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

SessionCreateParams params =
  SessionCreateParams.builder()
    .addLineItem(
      SessionCreateParams.LineItem.builder()
        .setPriceData(
          SessionCreateParams.LineItem.PriceData.builder()
            .setCurrency("usd")
            .setProductData(
              SessionCreateParams.LineItem.PriceData.ProductData.builder()
                .setName("T-shirt")
                .build()
            )
            .setUnitAmount(1000L)
            .build()
        )
        .setQuantity(1L)
        .build()
    )
    .setPaymentIntentData(
      SessionCreateParams.PaymentIntentData.builder().setApplicationFeeAmount(123L).build()
    )
    .setMode(SessionCreateParams.Mode.PAYMENT)
    .setSuccessUrl("https://example.com/success?session_id={CHECKOUT_SESSION_ID}")
    .build();

Session session = Session.create(params);
```

```node
const stripe = require("stripe")("<<secret key>>");

const session = await stripe.checkout.sessions.create({
  line_items: [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: "T-shirt",
        },
        unit_amount: 1000,
      },
      quantity: 1,
    },
  ],
  payment_intent_data: {
    application_fee_amount: 123,
  },
  mode: "payment",
  success_url: "https://example.com/success?session_id={CHECKOUT_SESSION_ID}",
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

session = stripe.checkout.Session.create(
  line_items=[
    {
      "price_data": {"currency": "usd", "product_data": {"name": "T-shirt"}, "unit_amount": 1000},
      "quantity": 1,
    },
  ],
  payment_intent_data={"application_fee_amount": 123},
  mode="payment",
  success_url="https://example.com/success?session_id={CHECKOUT_SESSION_ID}",
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$session = $stripe->checkout->sessions->create([
  'line_items' => [
    [
      'price_data' => [
        'currency' => 'usd',
        'product_data' => ['name' => 'T-shirt'],
        'unit_amount' => 1000,
      ],
      'quantity' => 1,
    ],
  ],
  'payment_intent_data' => ['application_fee_amount' => 123],
  'mode' => 'payment',
  'success_url' => 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

session = Stripe::Checkout::Session.create({
  line_items: [
    {
      price_data: {
        currency: 'usd',
        product_data: {name: 'T-shirt'},
        unit_amount: 1000,
      },
      quantity: 1,
    },
  ],
  payment_intent_data: {application_fee_amount: 123},
  mode: 'payment',
  success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
})
```

- `line_items` - This attribute represents items that your customer is purchasing and shows up in the Stripe-hosted checkout page.
- `payment_intent_data[application_fee_amount]` - This attribute specifies the amount your platform deducts from the transaction as an application fee. After the payment is processed on the connected account, the `application_fee_amount` is transferred to the platform. See [collect fees](#collect-fees) for more information.
- `success_url` - Stripe redirects the customer to the success URL after they complete a payment and replaces the `{CHECKOUT_SESSION_ID}` string with the Checkout Session ID. Use this to retrieve the Checkout Session and inspect the status to decide what to show your customer. You can also append your own query parameters, which persist through the redirect process. See [customize redirect behavior with a Stripe-hosted page](https://docs.stripe.com/payments/checkout/custom-success-page.md) for more information.
- `Stripe-Account` - This header indicates a direct charge for your connected account. The connected account’s [branding](#branding) is used in Checkout, which allows their customers to feel like they’re interacting directly with the connected account instead of your platform.

Charges that you create directly on the connected account are reported only on that account. These charges aren’t shown in your platform’s Dashboard or exports. Direct charges are included in reports and Sigma for connected accounts that your platform controls. You can always retrieve this information using the Stripe API.

## Handle post-payment events

Stripe sends a [checkout.session.completed](https://docs.stripe.com/api/events/types.md#event_types-checkout.session.completed) event when the payment completes. [Use a webhook to receive these events](https://docs.stripe.com/webhooks/quickstart.md) and run actions, like sending an order confirmation email to your customer, logging the sale in a database, or starting a shipping workflow.

Listen for these events rather than waiting on a callback from the client. On the client, the customer could close the browser window or quit the app before the callback executes. Some payment methods also take 2-14 days for payment confirmation. Setting up your integration to listen for asynchronous events enables you to accept multiple [payment methods](https://stripe.com/payments/payment-methods-guide) with a single integration.

Stripe recommends handling all of the following events when collecting payments with Checkout:

| Event                                                                                                                                        | Description                                                                           | Next steps                                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [checkout.session.completed](https://docs.stripe.com/api/events/types.md#event_types-checkout.session.completed)                             | The customer has successfully authorized the payment by submitting the Checkout form. | Wait for the payment to succeed or fail.                                    |
| [checkout.session.async_payment_succeeded](https://docs.stripe.com/api/events/types.md#event_types-checkout.session.async_payment_succeeded) | The customer’s payment succeeded.                                                     | Fulfill the purchased goods or services.                                    |
| [checkout.session.async_payment_failed](https://docs.stripe.com/api/events/types.md#event_types-checkout.session.async_payment_failed)       | The payment was declined, or failed for some other reason.                            | Contact the customer through email and request that they place a new order. |

These events all include the [Checkout Session](https://docs.stripe.com/api/checkout/sessions.md) object. After the payment succeeds, the underlying _PaymentIntent_ [status](https://docs.stripe.com/payments/paymentintents/lifecycle.md) changes from `processing` to `succeeded` or a failure status.

## Test the integration

| Card number         | Scenario                                                            | How to test                                                                                           |
| ------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 4242424242424242    | The card payment succeeds and doesn’t require authentication.       | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |
| 4000002500003155    | The card payment requires _authentication_.                         | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |
| 4000000000009995    | The card is declined with a decline code like `insufficient_funds`. | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |
| 6205500000000000004 | The UnionPay card has a variable length of 13-19 digits.            | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |

| Payment method | Scenario                                                                                                                                                                   | How to test                                                                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                | Your customer fails to authenticate on the redirect page for a redirect-based and immediate notification payment method.                                                   | Choose any redirect-based payment method, fill out the required details, and confirm the payment. Then click **Fail test payment** on the redirect page. |
| Pay by Bank    | Your customer successfully pays with a redirect-based and [delayed notification](https://docs.stripe.com/payments/payment-methods.md#payment-notification) payment method. | Choose the payment method, fill out the required details, and confirm the payment. Then click **Complete test payment** on the redirect page.            |
| Pay by Bank    | Your customer fails to authenticate on the redirect page for a redirect-based and delayed notification payment method.                                                     | Choose the payment method, fill out the required details, and confirm the payment. Then click **Fail test payment** on the redirect page.                |

| Payment method    | Scenario                                                                                          | How to test                                                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEPA Direct Debit | Your customer successfully pays with SEPA Direct Debit.                                           | Fill out the form using the account number `AT321904300235473204`. The confirmed PaymentIntent initially transitions to processing, then transitions to the succeeded status three minutes later. |
| SEPA Direct Debit | Your customer’s payment intent status transitions from `processing` to `requires_payment_method`. | Fill out the form using the account number `AT861904300235473202`.                                                                                                                                |

See [Testing](https://docs.stripe.com/testing.md) for additional information to test your integration.

## Enable additional payment methods

Navigate to [Manage payment methods for your connected accounts](https://dashboard.stripe.com/settings/payment_methods/connected_accounts) in the Dashboard to configure which payment methods your connected accounts accept. Changes to default settings apply to all new and existing connected accounts.

Consult the following resources for payment method information:

- [A guide to payment methods](https://stripe.com/payments/payment-methods-guide#choosing-the-right-payment-methods-for-your-business) to help you choose the correct payment methods for your platform.
- [Account capabilities](https://docs.stripe.com/connect/account-capabilities.md) to make sure your chosen payment methods work for your connected accounts.
- [Payment method and product support](https://docs.stripe.com/payments/payment-methods/payment-method-support.md#product-support) tables to make sure your chosen payment methods work for your Stripe products and payments flows.

For each payment method, you can select one of the following dropdown options:

| |
| |
| **On by default** | Your connected accounts accept this payment method during checkout. Some payment methods can only be off or blocked. This is because your connected accounts with _access to the Stripe Dashboard_ must activate them in their settings page. |
| **Off by default** | Your connected accounts don’t accept this payment method during checkout. If you allow your connected accounts with _access to the Stripe Dashboard_ to manage their own payment methods, they have the ability to turn it on. |
| **Blocked** | Your connected accounts don’t accept this payment method during checkout. If you allow your connected accounts with _access to the Stripe Dashboard_ to manage their own payment methods, they don’t have the option to turn it on. |

![Dropdown options for payment methods, each showing an available option (blocked, on by default, off by default)](images/connect/payment-methods/dropdowns.png)
Payment method options

If you make a change to a payment method, you must click **Review changes** in the bottom bar of your screen and **Save and apply** to update your connected accounts.

![Dialog that shows after clicking Save button with a list of what the user changed](images/connect/payment-methods/dialog.png)
Save dialog

### Allow connected accounts to manage payment methods

Stripe recommends allowing your connected accounts to customize their own payment methods. This option allows each connected account with _access to the Stripe Dashboard_ to view and update their [Payment methods](https://dashboard.stripe.com/settings/payment_methods) page. Only owners of the connected accounts can customize their payment methods. The Stripe Dashboard displays the set of payment method defaults you applied to all new and existing connected accounts. Your connected accounts can override these defaults, excluding payment methods you have blocked.

Check the **Account customization** checkbox to enable this option. You must click **Review changes** in the bottom bar of your screen and then select **Save and apply** to update this setting.

![Screenshot of the checkbox to select when allowing connected owners to customize payment methods](images/connect/payment-methods/checkbox.png)
Account customization checkbox

### Payment method capabilities

To allow your connected accounts to accept additional payment methods, you must make sure their connected accounts have active [capabilities for each payment method](https://docs.stripe.com/connect/account-capabilities.md#payment-methods). Most payment methods have the same verification requirements as the `card_payments` capability, with some restrictions and exceptions. The payment method capabilities table lists the payment methods that require additional verification over cards.

Navigate to the [Connected account payment settings](https://dashboard.stripe.com/settings/payment_methods/connected_accounts) in the Dashboard to request capabilities on your new and existing connected accounts for each payment method and country combination.

For an existing connected account, you can [list](https://docs.stripe.com/api/capabilities/list.md) their existing capabilities to determine whether you need to request additional capabilities.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var service = new AccountCapabilityService();
StripeList<Capability> capabilities = service.List("<<connectedAccount>>");
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CapabilityListParams{Account: stripe.String("<<connectedAccount>>")};
result := capability.List(params);
```

```java
Stripe.apiKey = "<<secret key>>";

Account resource = Account.retrieve("<<connectedAccount>>");

AccountCapabilitiesParams params = AccountCapabilitiesParams.builder().build();

CapabilityCollection capabilities = resource.capabilities(params);
```

```node
const stripe = require("stripe")("<<secret key>>");

const capabilities = await stripe.accounts.listCapabilities("<<connectedAccount>>");
```

```python
import stripe
stripe.api_key = "<<secret key>>"

capabilities = stripe.Account.list_capabilities("<<connectedAccount>>")
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$capabilities = $stripe->accounts->allCapabilities('<<connectedAccount>>', []);
```

```ruby
Stripe.api_key = '<<secret key>>'

capabilities = Stripe::Account.list_capabilities('<<connectedAccount>>')
```

Request additional capabilities by [updating](https://docs.stripe.com/api/capabilities/update.md) each connected account’s capabilities.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new AccountCapabilityUpdateOptions { Requested = true };
var service = new AccountCapabilityService();
Capability capability = service.Update(
    "<<connectedAccount>>",
    "us_bank_account_ach_payments",
    options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CapabilityParams{
  Requested: stripe.Bool(true),
  Account: stripe.String("<<connectedAccount>>"),
};
result, err := capability.Update("us_bank_account_ach_payments", params);
```

```java
Stripe.apiKey = "<<secret key>>";

Account account = Account.retrieve("<<connectedAccount>>");

Capability resource = account.capabilities().retrieve("us_bank_account_ach_payments");

CapabilityUpdateParams params = CapabilityUpdateParams.builder().setRequested(true).build();

Capability capability = resource.update(params);
```

```node
const stripe = require("stripe")("<<secret key>>");

const capability = await stripe.accounts.updateCapability(
  "<<connectedAccount>>",
  "us_bank_account_ach_payments",
  {
    requested: true,
  }
);
```

```python
import stripe
stripe.api_key = "<<secret key>>"

capability = stripe.Account.modify_capability(
  "<<connectedAccount>>",
  "us_bank_account_ach_payments",
  requested=True,
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$capability = $stripe->accounts->updateCapability(
  '<<connectedAccount>>',
  'us_bank_account_ach_payments',
  ['requested' => true]
);
```

```ruby
Stripe.api_key = '<<secret key>>'

capability = Stripe::Account.update_capability(
  '<<connectedAccount>>',
  'us_bank_account_ach_payments',
  {requested: true},
)
```

There can be a delay before the requested capability becomes active. If the capability has any activation requirements, the response includes them in the `requirements` arrays.

## Collect fees

When a payment is processed, your platform can take a portion of the transaction in the form of application fees. You can set application fee pricing in two ways:

- Use the [Platform Pricing Tool](https://docs.stripe.com/connect/platform-pricing-tools.md) to set and test pricing rules. This no-code feature in the Stripe Dashboard is currently only available for platforms responsible for paying Stripe fees.
- Set your pricing rules in-house, specifying application fees directly in a [PaymentIntent](https://docs.stripe.com/api/payment_intents/object.md). Fees set with this method override the pricing logic specified in the Platform Pricing Tool.

Your platform can take an application fee with the following limitations:

- The value of `application_fee_amount` must be positive and less than the amount of the charge. The application fee collected is capped at the amount of the charge.
- There are no additional Stripe fees on the application fee itself.
- In line with Brazilian regulatory and compliance requirements, platforms based outside of Brazil, with Brazilian connected accounts can’t collect application fees through Stripe.
- The currency of `application_fee_amount` depends upon a few [multiple currency](https://docs.stripe.com/connect/currencies.md) factors.

The resulting charge’s [balance transaction](https://docs.stripe.com/api.md#balance_transaction_retrieve) includes a detailed fee breakdown of both the Stripe and application fees. To provide a better reporting experience, an [Application Fee](https://docs.stripe.com/api/application_fees/object.md) is created after the fee is collected. Use the `amount` property on the application fee object for reporting. You can then access these objects with the [Application Fees](https://docs.stripe.com/api/application_fees/list.md) endpoint.

Earned application fees are added to your available account balance on the same schedule as funds from regular Stripe charges. Application fees are viewable in the [Collected fees](https://dashboard.stripe.com/connect/application_fees) section of the Dashboard.

Application fees for direct charges are created asynchronously by default. If you expand the `application_fee` object in a charge creation request, the application fee is created synchronously as part of that request. Only expand the `application_fee` object if you must, because it increases the latency of the request.

To access the application fee objects for application fees that are created asynchronously, listen for the [application_fee.created](https://docs.stripe.com/api/events/types.md#event_types-application_fee.created) webhook event.

### Flow of funds with fees

When you specify an application fee on a charge, the fee amount is transferred to your platform’s Stripe account. When processing a charge directly on the connected account, the charge amount—less the application fee—is deposited into the connected account.

For example, if you make a charge of 10 USD with a 1.23 USD application fee (like in the previous example), 1.23 USD is transferred to your platform account.

If you process payments in multiple currencies, read [how currencies are handled](https://docs.stripe.com/connect/currencies.md) in Connect.

## Customize branding

Your platform and connected accounts can use the [Branding settings](https://dashboard.stripe.com/account/branding) in the Dashboard to customize branding on the payments page. For direct charges, Checkout uses the brand settings of the connected account.

Embed a prebuilt payment form on your site using [Stripe Checkout](https://docs.stripe.com/payments/checkout.md). See how this integration [compares to Stripe’s other integration types](https://docs.stripe.com/payments/online-payments.md#compare-features-and-availability).

Embed prebuilt payment form on your site

- 20 preset fonts
- 3 preset border radius
- Custom background and border color
- Custom logo

Use our official libraries to access the Stripe API from your application:

```bash
\# Available as a gem
sudo gem install stripe
```

```ruby
\# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

```bash
\# Install through pip
pip3 install --upgrade stripe
```

```bash
\# Or find the Stripe package on http://pypi.python.org/pypi/stripe/
```

```python
\# Find the version you want to pin:
# https://github.com/stripe/stripe-python/blob/master/CHANGELOG.md
# Specify that version in your requirements.txt file
stripe>=5.0.0
```

```bash
\# Install the PHP library with Composer
composer require stripe/stripe-php
```

```bash
\# Or download the source directly: https://github.com/stripe/stripe-php/releases
```

```java
/*
  For Gradle, add the following dependency to your build.gradle and replace with
  the version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
*/
implementation "com.stripe:stripe-java:29.0.0"
```

```xml
<!--
  For Maven, add the following dependency to your POM and replace with the
  version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
-->
<dependency>
  <groupId>com.stripe</groupId>
  <artifactId>stripe-java</artifactId>
  <version>29.0.0</version>
</dependency>
```

```bash
\# For other environments, manually install the following JARs:
# - The Stripe JAR from https://github.com/stripe/stripe-java/releases/latest
# - Google Gson from https://github.com/google/gson
```

```bash
\# Install with npm
npm install stripe --save
```

```bash
\# Make sure your project is using Go Modules
go mod init
# Install stripe-go
go get -u github.com/stripe/stripe-go/v82
```

```go
// Then import the package
import (
  "github.com/stripe/stripe-go/v82"
)
```

```bash
\# Install with dotnet
dotnet add package Stripe.net
dotnet restore
```

```bash
\# Or install with NuGet
Install-Package Stripe.net
```

## Create a Checkout Session

A [Checkout Session](https://docs.stripe.com/api/checkout/sessions.md) controls what your customer sees in the embeddable payment form such as line items, the order amount and currency. Create a Checkout Session in a server-side endpoint (for example, `/create-checkout-session`). The response includes a `client_secret` which you’ll use in the next step to mount Checkout.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new Stripe.Checkout.SessionCreateOptions
{
    LineItems = new List<Stripe.Checkout.SessionLineItemOptions>
    {
        new Stripe.Checkout.SessionLineItemOptions
        {
            PriceData = new Stripe.Checkout.SessionLineItemPriceDataOptions
            {
                Currency = "usd",
                ProductData = new Stripe.Checkout.SessionLineItemPriceDataProductDataOptions
                {
                    Name = "T-shirt",
                },
                UnitAmount = 1000,
            },
            Quantity = 1,
        },
    },
    PaymentIntentData = new Stripe.Checkout.SessionPaymentIntentDataOptions
    {
        ApplicationFeeAmount = 123,
    },
    Mode = "payment",
    UiMode = "embedded",
    ReturnUrl = "https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}",
};
var service = new Stripe.Checkout.SessionService();
Stripe.Checkout.Session session = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CheckoutSessionParams{
  LineItems: []*stripe.CheckoutSessionLineItemParams{
    &stripe.CheckoutSessionLineItemParams{
      PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
        Currency: stripe.String(string(stripe.CurrencyUSD)),
        ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
          Name: stripe.String("T-shirt"),
        },
        UnitAmount: stripe.Int64(1000),
      },
      Quantity: stripe.Int64(1),
    },
  },
  PaymentIntentData: &stripe.CheckoutSessionPaymentIntentDataParams{
    ApplicationFeeAmount: stripe.Int64(123),
  },
  Mode: stripe.String(string(stripe.CheckoutSessionModePayment)),
  UIMode: stripe.String(string(stripe.CheckoutSessionUIModeEmbedded)),
  ReturnURL: stripe.String("https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}"),
};
result, err := session.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

SessionCreateParams params =
  SessionCreateParams.builder()
    .addLineItem(
      SessionCreateParams.LineItem.builder()
        .setPriceData(
          SessionCreateParams.LineItem.PriceData.builder()
            .setCurrency("usd")
            .setProductData(
              SessionCreateParams.LineItem.PriceData.ProductData.builder()
                .setName("T-shirt")
                .build()
            )
            .setUnitAmount(1000L)
            .build()
        )
        .setQuantity(1L)
        .build()
    )
    .setPaymentIntentData(
      SessionCreateParams.PaymentIntentData.builder().setApplicationFeeAmount(123L).build()
    )
    .setMode(SessionCreateParams.Mode.PAYMENT)
    .setUiMode(SessionCreateParams.UiMode.EMBEDDED)
    .setReturnUrl("https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}")
    .build();

Session session = Session.create(params);
```

```node
const stripe = require("stripe")("<<secret key>>");

const session = await stripe.checkout.sessions.create({
  line_items: [
    {
      price_data: {
        currency: "usd",
        product_data: {
          name: "T-shirt",
        },
        unit_amount: 1000,
      },
      quantity: 1,
    },
  ],
  payment_intent_data: {
    application_fee_amount: 123,
  },
  mode: "payment",
  ui_mode: "embedded",
  return_url: "https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}",
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

session = stripe.checkout.Session.create(
  line_items=[
    {
      "price_data": {"currency": "usd", "product_data": {"name": "T-shirt"}, "unit_amount": 1000},
      "quantity": 1,
    },
  ],
  payment_intent_data={"application_fee_amount": 123},
  mode="payment",
  ui_mode="embedded",
  return_url="https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}",
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$session = $stripe->checkout->sessions->create([
  'line_items' => [
    [
      'price_data' => [
        'currency' => 'usd',
        'product_data' => ['name' => 'T-shirt'],
        'unit_amount' => 1000,
      ],
      'quantity' => 1,
    ],
  ],
  'payment_intent_data' => ['application_fee_amount' => 123],
  'mode' => 'payment',
  'ui_mode' => 'embedded',
  'return_url' => 'https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}',
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

session = Stripe::Checkout::Session.create({
  line_items: [
    {
      price_data: {
        currency: 'usd',
        product_data: {name: 'T-shirt'},
        unit_amount: 1000,
      },
      quantity: 1,
    },
  ],
  payment_intent_data: {application_fee_amount: 123},
  mode: 'payment',
  ui_mode: 'embedded',
  return_url: 'https://example.com/checkout/return?session_id={CHECKOUT_SESSION_ID}',
})
```

- `line_items`: This attribute represents items that your customer is purchasing and shows up in the embedded payment form.
- `payment_intent_data[application_fee_amount]`: This attribute specifies the amount your platform deducts from the transaction as an application fee. After the payment is processed on the connected account, the `application_fee_amount` is transferred to the platform. See [collect fees](#collect-fees) for more information.
- `return_url` - Stripe redirects the customer to the return URL after they complete a payment attempt and replaces the `{CHECKOUT_SESSION_ID}` string with the Checkout Session ID. Use this to retrieve the Checkout Session and inspect the status to decide what to show your customer. Make sure the return URL corresponds to a page on your website that provides the status of the payment. You can also append your own query parameters, which persist through the redirect process. See [customize redirect behavior with an embedded form](https://docs.stripe.com/payments/checkout/custom-success-page.md?payment-ui=embedded-form) for more information.
- `Stripe-Account` - This header indicates a direct charge for your connected account. The connected account’s [branding](#branding) is used in Checkout, which allows their customers to feel like they’re interacting directly with the connected account instead of your platform.

Charges that you create directly on the connected account are reported only on that account. These charges aren’t shown in your platform’s Dashboard, exports, or other reporting, although you can always retrieve this information using the Stripe API.

## Mount Checkout

Checkout is available as part of [Stripe.js](https://docs.stripe.com/js). Include the Stripe.js script on your page by adding it to the head of your HTML file. Next, create an empty DOM node (container) to use for mounting.

```html
<head>
  <script src="https://js.stripe.com/basil/stripe.js"></script>
</head>
<body>
  <div id="checkout">
    <!-- Checkout will insert the payment form here -->
  </div>
</body>
```

Initialize Stripe.js with your publishable API key and the connected account ID. Pass the `client_secret` from the previous step into `options` when you create the Checkout instance:

```javascript
// Initialize Stripe.js

initialize();

// Fetch Checkout Session and retrieve the client secret
async function initialize() {
  const fetchClientSecret = async () => {
    const response = await fetch("/create-checkout-session", {
      method: "POST",
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  // Initialize Checkout
  const checkout = await stripe.initEmbeddedCheckout({
    fetchClientSecret,
  });

  // Mount Checkout
  checkout.mount("#checkout");
}
```

Install [React Stripe.js](https://www.npmjs.com/package/@stripe/react-stripe-js) and the [Stripe.js loader](https://www.npmjs.com/package/@stripe/stripe-js) from the npm public registry:

```bash
npm install --save @stripe/react-stripe-js @stripe/stripe-js
```

To use the Embedded Checkout component, create an `EmbeddedCheckoutProvider`. Call `loadStripe` with your publishable API key and pass the returned `Promise` to the provider. Use the `options` prop accepted by the provider to pass the `client_secret` from the previous step.

```jsx
import * as React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("<<publishable key>>", {
  stripeAccount: "<<connectedAccount>>",
});
const App = ({ clientSecret }) => {
  const options = { clientSecret };
  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
};
```

Checkout is rendered in an iframe that securely sends payment information to Stripe over an HTTPS connection. Avoid placing Checkout within another iframe because some payment methods require redirecting to another page for payment confirmation.

## Handle post-payment events

Stripe sends a [checkout.session.completed](https://docs.stripe.com/api/events/types.md#event_types-checkout.session.completed) event when the payment completes. [Use a webhook to receive these events](https://docs.stripe.com/webhooks/quickstart.md) and run actions, like sending an order confirmation email to your customer, logging the sale in a database, or starting a shipping workflow.

Listen for these events rather than waiting on a callback from the client. On the client, the customer could close the browser window or quit the app before the callback executes. Some payment methods also take 2-14 days for payment confirmation. Setting up your integration to listen for asynchronous events enables you to accept multiple [payment methods](https://stripe.com/payments/payment-methods-guide) with a single integration.

Stripe recommends handling all of the following events when collecting payments with Checkout:

| Event                                                                                                                                        | Description                                                                           | Next steps                                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| [checkout.session.completed](https://docs.stripe.com/api/events/types.md#event_types-checkout.session.completed)                             | The customer has successfully authorized the payment by submitting the Checkout form. | Wait for the payment to succeed or fail.                                    |
| [checkout.session.async_payment_succeeded](https://docs.stripe.com/api/events/types.md#event_types-checkout.session.async_payment_succeeded) | The customer’s payment succeeded.                                                     | Fulfill the purchased goods or services.                                    |
| [checkout.session.async_payment_failed](https://docs.stripe.com/api/events/types.md#event_types-checkout.session.async_payment_failed)       | The payment was declined, or failed for some other reason.                            | Contact the customer through email and request that they place a new order. |

These events all include the [Checkout Session](https://docs.stripe.com/api/checkout/sessions.md) object. After the payment succeeds, the underlying _PaymentIntent_ [status](https://docs.stripe.com/payments/paymentintents/lifecycle.md) changes from `processing` to `succeeded` or a failure status.

## Test the integration

| Card number         | Scenario                                                            | How to test                                                                                           |
| ------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 4242424242424242    | The card payment succeeds and doesn’t require authentication.       | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |
| 4000002500003155    | The card payment requires _authentication_.                         | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |
| 4000000000009995    | The card is declined with a decline code like `insufficient_funds`. | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |
| 6205500000000000004 | The UnionPay card has a variable length of 13-19 digits.            | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |

| Payment method | Scenario                                                                                                                                                                   | How to test                                                                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                | Your customer fails to authenticate on the redirect page for a redirect-based and immediate notification payment method.                                                   | Choose any redirect-based payment method, fill out the required details, and confirm the payment. Then click **Fail test payment** on the redirect page. |
| Pay by Bank    | Your customer successfully pays with a redirect-based and [delayed notification](https://docs.stripe.com/payments/payment-methods.md#payment-notification) payment method. | Choose the payment method, fill out the required details, and confirm the payment. Then click **Complete test payment** on the redirect page.            |
| Pay by Bank    | Your customer fails to authenticate on the redirect page for a redirect-based and delayed notification payment method.                                                     | Choose the payment method, fill out the required details, and confirm the payment. Then click **Fail test payment** on the redirect page.                |

| Payment method    | Scenario                                                                                          | How to test                                                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEPA Direct Debit | Your customer successfully pays with SEPA Direct Debit.                                           | Fill out the form using the account number `AT321904300235473204`. The confirmed PaymentIntent initially transitions to processing, then transitions to the succeeded status three minutes later. |
| SEPA Direct Debit | Your customer’s payment intent status transitions from `processing` to `requires_payment_method`. | Fill out the form using the account number `AT861904300235473202`.                                                                                                                                |

See [Testing](https://docs.stripe.com/testing.md) for additional information to test your integration.

## Enable additional payment methods

Navigate to [Manage payment methods for your connected accounts](https://dashboard.stripe.com/settings/payment_methods/connected_accounts) in the Dashboard to configure which payment methods your connected accounts accept. Changes to default settings apply to all new and existing connected accounts.

Consult the following resources for payment method information:

- [A guide to payment methods](https://stripe.com/payments/payment-methods-guide#choosing-the-right-payment-methods-for-your-business) to help you choose the correct payment methods for your platform.
- [Account capabilities](https://docs.stripe.com/connect/account-capabilities.md) to make sure your chosen payment methods work for your connected accounts.
- [Payment method and product support](https://docs.stripe.com/payments/payment-methods/payment-method-support.md#product-support) tables to make sure your chosen payment methods work for your Stripe products and payments flows.

For each payment method, you can select one of the following dropdown options:

| |
| |
| **On by default** | Your connected accounts accept this payment method during checkout. Some payment methods can only be off or blocked. This is because your connected accounts with _access to the Stripe Dashboard_ must activate them in their settings page. |
| **Off by default** | Your connected accounts don’t accept this payment method during checkout. If you allow your connected accounts with _access to the Stripe Dashboard_ to manage their own payment methods, they have the ability to turn it on. |
| **Blocked** | Your connected accounts don’t accept this payment method during checkout. If you allow your connected accounts with _access to the Stripe Dashboard_ to manage their own payment methods, they don’t have the option to turn it on. |

![Dropdown options for payment methods, each showing an available option (blocked, on by default, off by default)](images/connect/payment-methods/dropdowns.png)
Payment method options

If you make a change to a payment method, you must click **Review changes** in the bottom bar of your screen and **Save and apply** to update your connected accounts.

![Dialog that shows after clicking Save button with a list of what the user changed](images/connect/payment-methods/dialog.png)
Save dialog

### Allow connected accounts to manage payment methods

Stripe recommends allowing your connected accounts to customize their own payment methods. This option allows each connected account with _access to the Stripe Dashboard_ to view and update their [Payment methods](https://dashboard.stripe.com/settings/payment_methods) page. Only owners of the connected accounts can customize their payment methods. The Stripe Dashboard displays the set of payment method defaults you applied to all new and existing connected accounts. Your connected accounts can override these defaults, excluding payment methods you have blocked.

Check the **Account customization** checkbox to enable this option. You must click **Review changes** in the bottom bar of your screen and then select **Save and apply** to update this setting.

![Screenshot of the checkbox to select when allowing connected owners to customize payment methods](images/connect/payment-methods/checkbox.png)
Account customization checkbox

### Payment method capabilities

To allow your connected accounts to accept additional payment methods, you must make sure their connected accounts have active [capabilities for each payment method](https://docs.stripe.com/connect/account-capabilities.md#payment-methods). Most payment methods have the same verification requirements as the `card_payments` capability, with some restrictions and exceptions. The payment method capabilities table lists the payment methods that require additional verification over cards.

Navigate to the [Connected account payment settings](https://dashboard.stripe.com/settings/payment_methods/connected_accounts) in the Dashboard to request capabilities on your new and existing connected accounts for each payment method and country combination.

For an existing connected account, you can [list](https://docs.stripe.com/api/capabilities/list.md) their existing capabilities to determine whether you need to request additional capabilities.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var service = new AccountCapabilityService();
StripeList<Capability> capabilities = service.List("<<connectedAccount>>");
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CapabilityListParams{Account: stripe.String("<<connectedAccount>>")};
result := capability.List(params);
```

```java
Stripe.apiKey = "<<secret key>>";

Account resource = Account.retrieve("<<connectedAccount>>");

AccountCapabilitiesParams params = AccountCapabilitiesParams.builder().build();

CapabilityCollection capabilities = resource.capabilities(params);
```

```node
const stripe = require("stripe")("<<secret key>>");

const capabilities = await stripe.accounts.listCapabilities("<<connectedAccount>>");
```

```python
import stripe
stripe.api_key = "<<secret key>>"

capabilities = stripe.Account.list_capabilities("<<connectedAccount>>")
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$capabilities = $stripe->accounts->allCapabilities('<<connectedAccount>>', []);
```

```ruby
Stripe.api_key = '<<secret key>>'

capabilities = Stripe::Account.list_capabilities('<<connectedAccount>>')
```

Request additional capabilities by [updating](https://docs.stripe.com/api/capabilities/update.md) each connected account’s capabilities.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new AccountCapabilityUpdateOptions { Requested = true };
var service = new AccountCapabilityService();
Capability capability = service.Update(
    "<<connectedAccount>>",
    "us_bank_account_ach_payments",
    options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CapabilityParams{
  Requested: stripe.Bool(true),
  Account: stripe.String("<<connectedAccount>>"),
};
result, err := capability.Update("us_bank_account_ach_payments", params);
```

```java
Stripe.apiKey = "<<secret key>>";

Account account = Account.retrieve("<<connectedAccount>>");

Capability resource = account.capabilities().retrieve("us_bank_account_ach_payments");

CapabilityUpdateParams params = CapabilityUpdateParams.builder().setRequested(true).build();

Capability capability = resource.update(params);
```

```node
const stripe = require("stripe")("<<secret key>>");

const capability = await stripe.accounts.updateCapability(
  "<<connectedAccount>>",
  "us_bank_account_ach_payments",
  {
    requested: true,
  }
);
```

```python
import stripe
stripe.api_key = "<<secret key>>"

capability = stripe.Account.modify_capability(
  "<<connectedAccount>>",
  "us_bank_account_ach_payments",
  requested=True,
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$capability = $stripe->accounts->updateCapability(
  '<<connectedAccount>>',
  'us_bank_account_ach_payments',
  ['requested' => true]
);
```

```ruby
Stripe.api_key = '<<secret key>>'

capability = Stripe::Account.update_capability(
  '<<connectedAccount>>',
  'us_bank_account_ach_payments',
  {requested: true},
)
```

There can be a delay before the requested capability becomes active. If the capability has any activation requirements, the response includes them in the `requirements` arrays.

## Collect fees

When a payment is processed, your platform can take a portion of the transaction in the form of application fees. You can set application fee pricing in two ways:

- Use the [Platform Pricing Tool](https://docs.stripe.com/connect/platform-pricing-tools.md) to set and test pricing rules. This no-code feature in the Stripe Dashboard is currently only available for platforms responsible for paying Stripe fees.
- Set your pricing rules in-house, specifying application fees directly in a [PaymentIntent](https://docs.stripe.com/api/payment_intents/object.md). Fees set with this method override the pricing logic specified in the Platform Pricing Tool.

Your platform can take an application fee with the following limitations:

- The value of `application_fee_amount` must be positive and less than the amount of the charge. The application fee collected is capped at the amount of the charge.
- There are no additional Stripe fees on the application fee itself.
- In line with Brazilian regulatory and compliance requirements, platforms based outside of Brazil, with Brazilian connected accounts can’t collect application fees through Stripe.
- The currency of `application_fee_amount` depends upon a few [multiple currency](https://docs.stripe.com/connect/currencies.md) factors.

The resulting charge’s [balance transaction](https://docs.stripe.com/api.md#balance_transaction_retrieve) includes a detailed fee breakdown of both the Stripe and application fees. To provide a better reporting experience, an [Application Fee](https://docs.stripe.com/api/application_fees/object.md) is created after the fee is collected. Use the `amount` property on the application fee object for reporting. You can then access these objects with the [Application Fees](https://docs.stripe.com/api/application_fees/list.md) endpoint.

Earned application fees are added to your available account balance on the same schedule as funds from regular Stripe charges. Application fees are viewable in the [Collected fees](https://dashboard.stripe.com/connect/application_fees) section of the Dashboard.

Application fees for direct charges are created asynchronously by default. If you expand the `application_fee` object in a charge creation request, the application fee is created synchronously as part of that request. Only expand the `application_fee` object if you must, because it increases the latency of the request.

To access the application fee objects for application fees that are created asynchronously, listen for the [application_fee.created](https://docs.stripe.com/api/events/types.md#event_types-application_fee.created) webhook event.

### Flow of funds with fees

When you specify an application fee on a charge, the fee amount is transferred to your platform’s Stripe account. When processing a charge directly on the connected account, the charge amount—less the application fee—is deposited into the connected account.

For example, if you make a charge of 10 USD with a 1.23 USD application fee (like in the previous example), 1.23 USD is transferred to your platform account.

If you process payments in multiple currencies, read [how currencies are handled](https://docs.stripe.com/connect/currencies.md) in Connect.

## Customize branding

Your platform and connected accounts can use the [Branding settings](https://dashboard.stripe.com/account/branding) in the Dashboard to customize branding on the payments page. For direct charges, Checkout uses the brand settings of the connected account.

Build a custom payments integration by embedding UI components on your site, using [Stripe Elements](https://docs.stripe.com/payments/elements.md). The client-side and server-side code builds a checkout form that accepts various payment methods.
See how this integration [compares to Stripe’s other integration types](https://docs.stripe.com/payments/online-payments.md#compare-features-and-availability).

Combine UI components into a custom payment flow

CSS-level customization with the Appearance API

Use our official libraries to access the Stripe API from your application:

```bash
\# Available as a gem
sudo gem install stripe
```

```ruby
\# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

```bash
\# Install through pip
pip3 install --upgrade stripe
```

```bash
\# Or find the Stripe package on http://pypi.python.org/pypi/stripe/
```

```python
\# Find the version you want to pin:
# https://github.com/stripe/stripe-python/blob/master/CHANGELOG.md
# Specify that version in your requirements.txt file
stripe>=5.0.0
```

```bash
\# Install the PHP library with Composer
composer require stripe/stripe-php
```

```bash
\# Or download the source directly: https://github.com/stripe/stripe-php/releases
```

```java
/*
  For Gradle, add the following dependency to your build.gradle and replace with
  the version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
*/
implementation "com.stripe:stripe-java:29.0.0"
```

```xml
<!--
  For Maven, add the following dependency to your POM and replace with the
  version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
-->
<dependency>
  <groupId>com.stripe</groupId>
  <artifactId>stripe-java</artifactId>
  <version>29.0.0</version>
</dependency>
```

```bash
\# For other environments, manually install the following JARs:
# - The Stripe JAR from https://github.com/stripe/stripe-java/releases/latest
# - Google Gson from https://github.com/google/gson
```

```bash
\# Install with npm
npm install stripe --save
```

```bash
\# Make sure your project is using Go Modules
go mod init
# Install stripe-go
go get -u github.com/stripe/stripe-go/v82
```

```go
// Then import the package
import (
  "github.com/stripe/stripe-go/v82"
)
```

```bash
\# Install with dotnet
dotnet add package Stripe.net
dotnet restore
```

```bash
\# Or install with NuGet
Install-Package Stripe.net
```

## Create a PaymentIntent

Stripe uses a [PaymentIntent](https://docs.stripe.com/api/payment_intents.md) object to represent your intent to collect payment from a customer, tracking charge attempts and payment state changes throughout the process.

The payment methods shown to customers during the checkout process are also included on the PaymentIntent. You can let Stripe automatically pull payment methods from your Dashboard settings or you can list them manually.

Unless your integration requires a code-based option for offering payment methods, don’t list payment methods manually. Stripe evaluates the currency, payment method restrictions, and other parameters to determine the list of supported payment methods.
Stripe prioritizes payment methods that help increase conversion and are most relevant to the currency and the customer’s location. Stripe hides lower priority payment methods in an overflow menu.

Create a PaymentIntent on your server with an amount and currency. In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
You can manage payment methods from the [Dashboard](https://dashboard.stripe.com/settings/payment_methods). Stripe handles the return of eligible payment methods based on factors such as the transaction’s amount, currency, and payment flow.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new PaymentIntentCreateOptions
{
    Amount = 1000,
    Currency = "usd",
    AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions { Enabled = true },
    ApplicationFeeAmount = 123,
};
var service = new PaymentIntentService();
PaymentIntent paymentIntent = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(1000),
  Currency: stripe.String(string(stripe.CurrencyUSD)),
  AutomaticPaymentMethods: &stripe.PaymentIntentAutomaticPaymentMethodsParams{
    Enabled: stripe.Bool(true),
  },
  ApplicationFeeAmount: stripe.Int64(123),
};
result, err := paymentintent.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

PaymentIntentCreateParams params =
  PaymentIntentCreateParams.builder()
    .setAmount(1000L)
    .setCurrency("usd")
    .setAutomaticPaymentMethods(
      PaymentIntentCreateParams.AutomaticPaymentMethods.builder().setEnabled(true).build()
    )
    .setApplicationFeeAmount(123L)
    .build();

PaymentIntent paymentIntent = PaymentIntent.create(params);
```

```node
const stripe = require("stripe")("<<secret key>>");

const paymentIntent = await stripe.paymentIntents.create({
  amount: 1000,
  currency: "usd",
  automatic_payment_methods: {
    enabled: true,
  },
  application_fee_amount: 123,
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

payment_intent = stripe.PaymentIntent.create(
  amount=1000,
  currency="usd",
  automatic_payment_methods={"enabled": True},
  application_fee_amount=123,
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$paymentIntent = $stripe->paymentIntents->create([
  'amount' => 1000,
  'currency' => 'usd',
  'automatic_payment_methods' => ['enabled' => true],
  'application_fee_amount' => 123,
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

payment_intent = Stripe::PaymentIntent.create({
  amount: 1000,
  currency: 'usd',
  automatic_payment_methods: {enabled: true},
  application_fee_amount: 123,
})
```

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new PaymentIntentCreateOptions
{
    Amount = 1099,
    Currency = "eur",
    PaymentMethodTypes = new List<string>
    {
        "bancontact",
        "card",
        "eps",
        "ideal",
        "p24",
        "sepa_debit",
        "sofort",
    },
    ApplicationFeeAmount = 123,
};
var service = new PaymentIntentService();
PaymentIntent paymentIntent = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.PaymentIntentParams{
  Amount: stripe.Int64(1099),
  Currency: stripe.String(string(stripe.CurrencyEUR)),
  PaymentMethodTypes: []*string{
    stripe.String("bancontact"),
    stripe.String("card"),
    stripe.String("eps"),
    stripe.String("ideal"),
    stripe.String("p24"),
    stripe.String("sepa_debit"),
    stripe.String("sofort"),
  },
  ApplicationFeeAmount: stripe.Int64(123),
};
result, err := paymentintent.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

PaymentIntentCreateParams params =
  PaymentIntentCreateParams.builder()
    .setAmount(1099L)
    .setCurrency("eur")
    .addPaymentMethodType("bancontact")
    .addPaymentMethodType("card")
    .addPaymentMethodType("eps")
    .addPaymentMethodType("ideal")
    .addPaymentMethodType("p24")
    .addPaymentMethodType("sepa_debit")
    .addPaymentMethodType("sofort")
    .setApplicationFeeAmount(123L)
    .build();

PaymentIntent paymentIntent = PaymentIntent.create(params);
```

```node
const stripe = require("stripe")("<<secret key>>");

const paymentIntent = await stripe.paymentIntents.create({
  amount: 1099,
  currency: "eur",
  payment_method_types: ["bancontact", "card", "eps", "ideal", "p24", "sepa_debit", "sofort"],
  application_fee_amount: 123,
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

payment_intent = stripe.PaymentIntent.create(
  amount=1099,
  currency="eur",
  payment_method_types=["bancontact", "card", "eps", "ideal", "p24", "sepa_debit", "sofort"],
  application_fee_amount=123,
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$paymentIntent = $stripe->paymentIntents->create([
  'amount' => 1099,
  'currency' => 'eur',
  'payment_method_types' => ['bancontact', 'card', 'eps', 'ideal', 'p24', 'sepa_debit', 'sofort'],
  'application_fee_amount' => 123,
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

payment_intent = Stripe::PaymentIntent.create({
  amount: 1099,
  currency: 'eur',
  payment_method_types: ['bancontact', 'card', 'eps', 'ideal', 'p24', 'sepa_debit', 'sofort'],
  application_fee_amount: 123,
})
```

When creating a PaymentIntent, you need to specify certain parameters:

- `amount` - Create a PaymentIntent on your server with a specified amount. Always determine how much to charge on the server side, as this is a trusted environment. This approach prevents malicious customers from choosing their own prices.
- `currency` - The currency you include in the PaymentIntent filters the payment methods shown to the customer, so choose it based on the payment methods you want to offer. For example, if you pass `eur` and have OXXO enabled in the Dashboard, OXXO won’t appear to the customer because it doesn’t support `eur` payments. Some payment methods support multiple currencies and countries. This guide uses Bancontact, credit cards, EPS, iDEAL, Przelewy24, SEPA Direct Debit, and Sofort in the example code.
- `"payment_method_types[]"` - Manually list all the payment methods you want to support.
- (Optional) `payment_intent_data[application_fee_amount]` - This argument specifies the amount your platform plans to take from the transaction. If you’re using Stripe’s [Platform Pricing Tool](https://docs.stripe.com/connect/platform-pricing-tools.md) to manage application fee pricing from the [Dashboard](https://dashboard.stripe.com/test/settings/connect/platform_pricing/payments), don’t include this argument as it’ll override any pricing logic set by the tool. After processing the payment on the connected account, the `application_fee_amount` transfers to the platform, and the Stripe fee is deducted from the connected account’s balance.

Each payment method needs to support the currency passed in the PaymentIntent and your business needs to be based in one of the countries each payment method supports. See [Payment method integration options](https://docs.stripe.com/payments/payment-methods/integration-options.md) for more details about what’s supported.

### Retrieve the client secret

The {{intentKind}} includes a _client secret_ that the client side uses to securely complete the payment process. You can use different approaches to pass the client secret to the client side.

Retrieve the client secret from an endpoint on your server, using the browser’s `fetch` function. This approach is best if your client side is a single-page application, particularly one built with a modern frontend framework like React. Create the server endpoint that serves the client secret:

```ruby
get '/secret' do
  intent = # ... Create or retrieve the {{intentKind}}
  {client_secret: intent.client_secret}.to_json
end
```

```python
from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/secret')
def secret():
  intent = # ... Create or retrieve the {{intentKind}}
  return jsonify(client_secret=intent.client_secret)
```

```php
<?php
    $intent = # ... Create or retrieve the {{intentKind}}
    echo json_encode(array('client_secret' => $intent->client_secret));
?>
```

```java
import java.util.HashMap;
import java.util.Map;

import com.stripe.model.{{intentKind}};

import com.google.gson.Gson;

import static spark.Spark.get;

public class StripeJavaQuickStart {
  public static void main(String[] args) {
    Gson gson = new Gson();

    get("/secret", (request, response) -> {
      {{intentKind}} intent = // ... Fetch or create the {{intentKind}}

      Map<String, String> map = new HashMap();
      map.put("client_secret", intent.getClientSecret());

      return map;
    }, gson::toJson);
  }
}
```

```javascript
const express = require("express");
const app = express();

app.get("/secret", async (req, res) => {
  const intent = // ... Fetch or create the {{intentKind}}
    res.json({ client_secret: intent.client_secret });
});

app.listen(3000, () => {
  console.log("Running on port 3000");
});
```

```go
package main

import (
  "encoding/json"
  "net/http"

  stripe "github.com/stripe/stripe-go/v{{golang.major_version}}"
)

type CheckoutData struct {
  ClientSecret string `json:"client_secret"`
}

func main() {
  http.HandleFunc("/secret", func(w http.ResponseWriter, r *http.Request) {
    intent := // ... Fetch or create the {{intentKind}}
    data := CheckoutData{
      ClientSecret: intent.ClientSecret,
    }
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    json.NewEncoder(w).Encode(data)
  })

  http.ListenAndServe(":3000", nil)
}
```

```csharp
using System;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace StripeExampleApi.Controllers
{
  [Route("secret")]
  [ApiController]
  public class CheckoutApiController : Controller
  {
    [HttpGet]
    public ActionResult Get()
    {
      var intent = // ... Fetch or create the {{intentKind}}
      return Json(new {client_secret = intent.ClientSecret});
    }
  }
}
```

And then fetch the client secret with JavaScript on the client side:

```javascript
(async () => {
  const response = await fetch("/secret");
  const { client_secret: clientSecret } = await response.json();
  // Render the form using the clientSecret
})();
```

Pass the client secret to the client from your server. This approach works best if your application generates static content on the server before sending it to the browser.

```erb
<form id="payment-form" data-secret="<%= @intent.client_secret %>">
  <button id="submit">Submit</button>
</form>
```

```ruby
get '/checkout' do
  @intent = # ... Fetch or create the {{intentKind}}
  erb :checkout
end
```

```html
<form id="payment-form" data-secret="{{ client_secret }}">
  <button id="submit">Submit</button>
</form>
```

```python
@app.route('/checkout')
def checkout():
  intent = # ... Fetch or create the {{intentKind}}
  return render_template('checkout.html', client_secret=intent.client_secret)
```

```php
<?php
  $intent = # ... Fetch or create the {{intentKind}};
?>
...
<form id="payment-form" data-secret="<?= $intent->client_secret ?>">
  <button id="submit">Submit</button>
</form>
...
```

```html
<form id="payment-form" data-secret="{{ client_secret }}">
  <button id="submit">Submit</button>
</form>
```

```java
import java.util.HashMap;
import java.util.Map;

import com.stripe.model.{{intentKind}};

import spark.ModelAndView;

import static spark.Spark.get;

public class StripeJavaQuickStart {
  public static void main(String[] args) {
    get("/checkout", (request, response) -> {
      {{intentKind}} intent = // ... Fetch or create the {{intentKind}}

      Map map = new HashMap();
      map.put("client_secret", intent.getClientSecret());

      return new ModelAndView(map, "checkout.hbs");
    }, new HandlebarsTemplateEngine());
  }
}
```

```html
<form id="payment-form" data-secret="{{ client_secret }}">
  <div id="payment-element">
    <!-- Elements will create form elements here -->
  </div>

  <button id="submit">Submit</button>
</form>
```

```javascript
const express = require("express");
const expressHandlebars = require("express-handlebars");
const app = express();

app.engine(".hbs", expressHandlebars({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.get("/checkout", async (req, res) => {
  const intent = // ... Fetch or create the {{intentKind}}
    res.render("checkout", { client_secret: intent.client_secret });
});

app.listen(3000, () => {
  console.log("Running on port 3000");
});
```

```html
<form id="payment-form" data-secret="{{ .ClientSecret }}">
  <button id="submit">Submit</button>
</form>
```

```go
package main

import (
  "html/template"
  "net/http"

  stripe "github.com/stripe/stripe-go/v{{golang.major_version}}"
)

type CheckoutData struct {
  ClientSecret string
}

func main() {
  checkoutTmpl := template.Must(template.ParseFiles("views/checkout.html"))

  http.HandleFunc("/checkout", func(w http.ResponseWriter, r *http.Request) {
    intent := // ... Fetch or create the {{intentKind}}
    data := CheckoutData{
      ClientSecret: intent.ClientSecret,
    }
    checkoutTmpl.Execute(w, data)
  })

  http.ListenAndServe(":3000", nil)
}
```

```html
<form id="payment-form" data-secret="@ViewData["ClientSecret"]">
  <button id="submit">Submit</button>
</form>
```

```csharp
using System;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace StripeExampleApi.Controllers
{
  [Route("/[controller]")]
  public class CheckoutApiController : Controller
  {
    public IActionResult Index()
    {
      var intent = // ... Fetch or create the {{intentKind}}
      ViewData["ClientSecret"] = intent.ClientSecret;
      return View();
    }
  }
}
```

## Collect payment details

Collect payment details on the client with the [Payment Element](https://docs.stripe.com/payments/payment-element.md). The Payment Element is a prebuilt UI component that simplifies collecting payment details for a variety of payment methods.

The Payment Element contains an iframe that securely sends payment information to Stripe over an HTTPS connection. Avoid placing the Payment Element within another iframe because some payment methods require redirecting to another page for payment confirmation.
If you do choose to use an iframe and want to accept Apple Pay or Google Pay, the iframe must have the [allow](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-allowpaymentrequest) attribute set to equal `"payment *"`.

The checkout page address must start with `https://` rather than `http://` for your integration to work. You can test your integration without using HTTPS, but remember to [enable it](https://docs.stripe.com/security/guide.md#tls) when you’re ready to accept live payments.

### Set up Stripe.js

The Payment Element is automatically available as a feature of Stripe.js. Include the Stripe.js script on your checkout page by adding it to the `head` of your HTML file. Always load Stripe.js directly from js.stripe.com to remain PCI compliant. Don’t include the script in a bundle or host a copy of it yourself.

```html
<head>
  <title>Checkout</title>
  <script src="https://js.stripe.com/basil/stripe.js"></script>
</head>
```

Create an instance of `Stripe` with the following JavaScript on your checkout page:

```javascript
// Initialize Stripe.js with the same connected account ID used when creating
// the PaymentIntent.
const stripe = Stripe("<<publishable key>>", {
  stripeAccount: "<<connectedAccount>>",
});
```

### Add Stripe Elements and the Payment Element to your payment page

The Payment Element needs a place to live on your payment page. Create an empty DOM node (container) with a unique ID in your payment form.

```html
<form id="payment-form">
  <div id="payment-element">
    <!-- Elements will create form elements here -->
  </div>
  <button id="submit">Pay</button>
</form>
```

When the form has loaded, create an instance of the Payment Element and mount it to the container DOM node along with the [client secret](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-client_secret) from the previous step. Pass this value as an option when creating the [Elements](https://docs.stripe.com/js/elements_object/create) instance.

The client secret must be handled carefully because it can complete the charge. Don’t log it, embed it in URLs, or expose it to anyone but the customer.

```javascript
const options = {
  clientSecret: "{{CLIENT_SECRET}}",
  // Fully customizable with the Appearance API
  appearance: {
    /*...*/
  },
};
// Set up Stripe.js and Elements to use in checkout form using the client secret
const elements = stripe.elements(options);
// Create and mount the Payment Element
const paymentElement = elements.create("payment");
paymentElement.mount("#payment-element");
```

The Payment Element renders a dynamic form that allows your customer to pick a payment method. The form automatically collects all necessary payments details for the payment method selected by the customer. You can [customize the appearance of the Payment Element](https://docs.stripe.com/elements/appearance-api.md) to match the design of your site when you set up the `Elements` object.

### Set up Stripe.js

Install [React Stripe.js](https://www.npmjs.com/package/@stripe/react-stripe-js) and the [Stripe.js loader](https://www.npmjs.com/package/@stripe/stripe-js) from the npm public registry:

```bash
npm install --save @stripe/react-stripe-js @stripe/stripe-js
```

### Add and configure the Elements provider to your payment page

To use the Payment Element component, wrap your checkout page component in an [Elements provider](https://docs.stripe.com/sdks/stripejs-react.md#elements-provider). Call `loadStripe` with your publishable key, and pass the returned `Promise` along with the [client secret](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-client_secret) from the previous step as `options` in the `Elements` provider.

```jsx
import React from "react";
import ReactDOM from "react-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("<<publishable key>>", {
  stripeAccount: "<<connectedAccount>>",
});
function App() {
  const options = {
    // pass the client secret from the previous step
    clientSecret: "{{CLIENT_SECRET}}",
    // Fully customizable with the Appearance API
    appearance: {
      /*...*/
    },
  };
  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
}
ReactDOM.render(<App />, document.getElementById("root"));
```

### Add the PaymentElement component

Use the `PaymentElement` component to build your form.

```jsx
import React from "react";
import { PaymentElement } from "@stripe/react-stripe-js";
const CheckoutForm = () => {
  return (
    <form>
      <PaymentElement />
      <button>Submit</button>
    </form>
  );
};
export default CheckoutForm;
```

The Payment Element renders a dynamic form that allows your customer to pick a payment method type. The form automatically collects all necessary payments details for the payment method selected by the customer. You can [customize the appearance of the Payment Element](https://docs.stripe.com/elements/appearance-api.md) to match the design of your site when you configure the `Elements` provider.

## Submit the payment to Stripe

Use [stripe.confirmPayment](https://docs.stripe.com/js/payment_intents/confirm_payment) to complete the payment using details from the Payment Element. Provide a [return_url](https://docs.stripe.com/api/payment_intents/create.md#create_payment_intent-return_url) to this function to indicate where Stripe should redirect the user after they complete the payment. Your user may be first redirected to an intermediate site, like a bank authorization page, before being redirected to the `return_url`. Card payments immediately redirect to the `return_url` when a payment is successful.

```javascript
const form = document.getElementById("payment-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const { error } = await stripe.confirmPayment({
    //`Elements` instance that was used to create the Payment Element
    elements,
    confirmParams: {
      return_url: "https://example.com/order/123/complete",
    },
  });

  if (error) {
    // This point will only be reached if there is an immediate error when
    // confirming the payment. Show error to your customer (for example, payment
    // details incomplete)
    const messageContainer = document.querySelector("#error-message");
    messageContainer.textContent = error.message;
  } else {
    // Your customer will be redirected to your `return_url`. For some payment
    // methods like iDEAL, your customer will be redirected to an intermediate
    // site first to authorize the payment, then redirected to the `return_url`.
  }
});
```

To call [stripe.confirmPayment](https://docs.stripe.com/js/payment_intents/confirm_payment) from your payment form component, use the [useStripe](https://docs.stripe.com/sdks/stripejs-react.md#usestripe-hook) and [useElements](https://docs.stripe.com/sdks/stripejs-react.md#useelements-hook) hooks.

If you prefer traditional class components over hooks, you can instead use an [ElementsConsumer](https://docs.stripe.com/sdks/stripejs-react.md#elements-consumer).

```jsx
import React, { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button disabled={!stripe}>Submit</button>
      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

export default CheckoutForm;
```

Make sure the `return_url` corresponds to a page on your website that provides the status of the payment. When Stripe redirects the customer to the `return_url`, we provide the following URL query parameters:

| Parameter                      | Description                                                                                                                                   |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `payment_intent`               | The unique identifier for the `PaymentIntent`.                                                                                                |
| `payment_intent_client_secret` | The [client secret](https://docs.stripe.com/api/payment_intents/object.md#payment_intent_object-client_secret) of the `PaymentIntent` object. |

If you have tooling that tracks the customer’s browser session, you might need to add the `stripe.com` domain to the referrer exclude list. Redirects cause some tools to create new sessions, which prevents you from tracking the complete session.

Use one of the query parameters to retrieve the PaymentIntent. Inspect the [status of the PaymentIntent](https://docs.stripe.com/payments/paymentintents/lifecycle.md) to decide what to show your customers. You can also append your own query parameters when providing the `return_url`, which persist through the redirect process.

```javascript
// Initialize Stripe.js using your publishable key
const stripe = Stripe("<<publishable key>>");

// Retrieve the "payment_intent_client_secret" query parameter appended to
// your return_url by Stripe.js
const clientSecret = new URLSearchParams(window.location.search).get(
  "payment_intent_client_secret"
);

// Retrieve the PaymentIntent
stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
  const message = document.querySelector("#message");

  // Inspect the PaymentIntent `status` to indicate the status of the payment
  // to your customer.
  //
  // Some payment methods will [immediately succeed or fail][0] upon
  // confirmation, while others will first enter a `processing` state.
  //
  // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
  switch (paymentIntent.status) {
    case "succeeded":
      message.innerText = "Success! Payment received.";
      break;

    case "processing":
      message.innerText = "Payment processing. We'll update you when payment is received.";
      break;

    case "requires_payment_method":
      message.innerText = "Payment failed. Please try another payment method.";
      // Redirect your user back to your payment page to attempt collecting
      // payment again
      break;

    default:
      message.innerText = "Something went wrong.";
      break;
  }
});
```

```jsx
import React, { useState, useEffect } from "react";
import { useStripe } from "@stripe/react-stripe-js";

const PaymentStatus = () => {
  const stripe = useStripe();
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    // Retrieve the "payment_intent_client_secret" query parameter appended to
    // your return_url by Stripe.js
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    // Retrieve the PaymentIntent
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      // Inspect the PaymentIntent `status` to indicate the status of the payment
      // to your customer.
      //
      // Some payment methods will [immediately succeed or fail][0] upon
      // confirmation, while others will first enter a `processing` state.
      //
      // [0]: https://stripe.com/docs/payments/payment-methods#payment-notification
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Success! Payment received.");
          break;

        case "processing":
          setMessage("Payment processing. We'll update you when payment is received.");
          break;

        case "requires_payment_method":
          // Redirect your user back to your payment page to attempt collecting
          // payment again
          setMessage("Payment failed. Please try another payment method.");
          break;

        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  return message;
};

export default PaymentStatus;
```

## Handle post-payment events

Stripe sends a [payment_intent.succeeded](https://docs.stripe.com/api/events/types.md#event_types-payment_intent.succeeded) event when the payment completes. Use the [Dashboard webhook tool](https://dashboard.stripe.com/webhooks) or follow the [webhook guide](https://docs.stripe.com/webhooks/quickstart.md) to receive these events and run actions, such as sending an order confirmation email to your customer, logging the sale in a database, or starting a shipping workflow.

Listen for these events rather than waiting on a callback from the client. On the client, the customer could close the browser window or quit the app before the callback executes, and malicious clients could manipulate the response. Setting up your integration to listen for asynchronous events is what enables you to accept [different types of payment methods](https://stripe.com/payments/payment-methods-guide) with a single integration.

In addition to handling the `payment_intent.succeeded` event, we recommend handling these other events when collecting payments with the Payment Element:

| Event                                                                                                                           | Description                                                                                                                                                                                                                                                                         | Action                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [payment_intent.succeeded](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.succeeded)           | Sent when a customer successfully completes a payment.                                                                                                                                                                                                                              | Send the customer an order confirmation and _fulfill_ their order.                                                                                                              |
| [payment_intent.processing](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.processing)         | Sent when a customer successfully initiates a payment, but the payment has yet to complete. This event is most commonly sent when the customer initiates a bank debit. It’s followed by either a `payment_intent.succeeded` or `payment_intent.payment_failed` event in the future. | Send the customer an order confirmation that indicates their payment is pending. For digital goods, you might want to fulfill the order before waiting for payment to complete. |
| [payment_intent.payment_failed](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.payment_failed) | Sent when a customer attempts a payment, but the payment fails.                                                                                                                                                                                                                     | If a payment transitions from `processing` to `payment_failed`, offer the customer another attempt to pay.                                                                      |

## Test the integration

| Card number         | Scenario                                                            | How to test                                                                                           |
| ------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 4242424242424242    | The card payment succeeds and doesn’t require authentication.       | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |
| 4000002500003155    | The card payment requires _authentication_.                         | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |
| 4000000000009995    | The card is declined with a decline code like `insufficient_funds`. | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |
| 6205500000000000004 | The UnionPay card has a variable length of 13-19 digits.            | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |

| Payment method | Scenario                                                                                                                                                                   | How to test                                                                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                | Your customer fails to authenticate on the redirect page for a redirect-based and immediate notification payment method.                                                   | Choose any redirect-based payment method, fill out the required details, and confirm the payment. Then click **Fail test payment** on the redirect page. |
| Pay by Bank    | Your customer successfully pays with a redirect-based and [delayed notification](https://docs.stripe.com/payments/payment-methods.md#payment-notification) payment method. | Choose the payment method, fill out the required details, and confirm the payment. Then click **Complete test payment** on the redirect page.            |
| Pay by Bank    | Your customer fails to authenticate on the redirect page for a redirect-based and delayed notification payment method.                                                     | Choose the payment method, fill out the required details, and confirm the payment. Then click **Fail test payment** on the redirect page.                |

| Payment method    | Scenario                                                                                          | How to test                                                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEPA Direct Debit | Your customer successfully pays with SEPA Direct Debit.                                           | Fill out the form using the account number `AT321904300235473204`. The confirmed PaymentIntent initially transitions to processing, then transitions to the succeeded status three minutes later. |
| SEPA Direct Debit | Your customer’s payment intent status transitions from `processing` to `requires_payment_method`. | Fill out the form using the account number `AT861904300235473202`.                                                                                                                                |

See [Testing](https://docs.stripe.com/testing.md) for additional information to test your integration.

## Enable additional payment methods

Navigate to [Manage payment methods for your connected accounts](https://dashboard.stripe.com/settings/payment_methods/connected_accounts) in the Dashboard to configure which payment methods your connected accounts accept. Changes to default settings apply to all new and existing connected accounts.

Consult the following resources for payment method information:

- [A guide to payment methods](https://stripe.com/payments/payment-methods-guide#choosing-the-right-payment-methods-for-your-business) to help you choose the correct payment methods for your platform.
- [Account capabilities](https://docs.stripe.com/connect/account-capabilities.md) to make sure your chosen payment methods work for your connected accounts.
- [Payment method and product support](https://docs.stripe.com/payments/payment-methods/payment-method-support.md#product-support) tables to make sure your chosen payment methods work for your Stripe products and payments flows.

For each payment method, you can select one of the following dropdown options:

| |
| |
| **On by default** | Your connected accounts accept this payment method during checkout. Some payment methods can only be off or blocked. This is because your connected accounts with _access to the Stripe Dashboard_ must activate them in their settings page. |
| **Off by default** | Your connected accounts don’t accept this payment method during checkout. If you allow your connected accounts with _access to the Stripe Dashboard_ to manage their own payment methods, they have the ability to turn it on. |
| **Blocked** | Your connected accounts don’t accept this payment method during checkout. If you allow your connected accounts with _access to the Stripe Dashboard_ to manage their own payment methods, they don’t have the option to turn it on. |

![Dropdown options for payment methods, each showing an available option (blocked, on by default, off by default)](images/connect/payment-methods/dropdowns.png)
Payment method options

If you make a change to a payment method, you must click **Review changes** in the bottom bar of your screen and **Save and apply** to update your connected accounts.

![Dialog that shows after clicking Save button with a list of what the user changed](images/connect/payment-methods/dialog.png)
Save dialog

### Allow connected accounts to manage payment methods

Stripe recommends allowing your connected accounts to customize their own payment methods. This option allows each connected account with _access to the Stripe Dashboard_ to view and update their [Payment methods](https://dashboard.stripe.com/settings/payment_methods) page. Only owners of the connected accounts can customize their payment methods. The Stripe Dashboard displays the set of payment method defaults you applied to all new and existing connected accounts. Your connected accounts can override these defaults, excluding payment methods you have blocked.

Check the **Account customization** checkbox to enable this option. You must click **Review changes** in the bottom bar of your screen and then select **Save and apply** to update this setting.

![Screenshot of the checkbox to select when allowing connected owners to customize payment methods](images/connect/payment-methods/checkbox.png)
Account customization checkbox

### Payment method capabilities

To allow your connected accounts to accept additional payment methods, you must make sure their connected accounts have active [capabilities for each payment method](https://docs.stripe.com/connect/account-capabilities.md#payment-methods). Most payment methods have the same verification requirements as the `card_payments` capability, with some restrictions and exceptions. The payment method capabilities table lists the payment methods that require additional verification over cards.

Navigate to the [Connected account payment settings](https://dashboard.stripe.com/settings/payment_methods/connected_accounts) in the Dashboard to request capabilities on your new and existing connected accounts for each payment method and country combination.

For an existing connected account, you can [list](https://docs.stripe.com/api/capabilities/list.md) their existing capabilities to determine whether you need to request additional capabilities.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var service = new AccountCapabilityService();
StripeList<Capability> capabilities = service.List("<<connectedAccount>>");
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CapabilityListParams{Account: stripe.String("<<connectedAccount>>")};
result := capability.List(params);
```

```java
Stripe.apiKey = "<<secret key>>";

Account resource = Account.retrieve("<<connectedAccount>>");

AccountCapabilitiesParams params = AccountCapabilitiesParams.builder().build();

CapabilityCollection capabilities = resource.capabilities(params);
```

```node
const stripe = require("stripe")("<<secret key>>");

const capabilities = await stripe.accounts.listCapabilities("<<connectedAccount>>");
```

```python
import stripe
stripe.api_key = "<<secret key>>"

capabilities = stripe.Account.list_capabilities("<<connectedAccount>>")
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$capabilities = $stripe->accounts->allCapabilities('<<connectedAccount>>', []);
```

```ruby
Stripe.api_key = '<<secret key>>'

capabilities = Stripe::Account.list_capabilities('<<connectedAccount>>')
```

Request additional capabilities by [updating](https://docs.stripe.com/api/capabilities/update.md) each connected account’s capabilities.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new AccountCapabilityUpdateOptions { Requested = true };
var service = new AccountCapabilityService();
Capability capability = service.Update(
    "<<connectedAccount>>",
    "us_bank_account_ach_payments",
    options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CapabilityParams{
  Requested: stripe.Bool(true),
  Account: stripe.String("<<connectedAccount>>"),
};
result, err := capability.Update("us_bank_account_ach_payments", params);
```

```java
Stripe.apiKey = "<<secret key>>";

Account account = Account.retrieve("<<connectedAccount>>");

Capability resource = account.capabilities().retrieve("us_bank_account_ach_payments");

CapabilityUpdateParams params = CapabilityUpdateParams.builder().setRequested(true).build();

Capability capability = resource.update(params);
```

```node
const stripe = require("stripe")("<<secret key>>");

const capability = await stripe.accounts.updateCapability(
  "<<connectedAccount>>",
  "us_bank_account_ach_payments",
  {
    requested: true,
  }
);
```

```python
import stripe
stripe.api_key = "<<secret key>>"

capability = stripe.Account.modify_capability(
  "<<connectedAccount>>",
  "us_bank_account_ach_payments",
  requested=True,
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$capability = $stripe->accounts->updateCapability(
  '<<connectedAccount>>',
  'us_bank_account_ach_payments',
  ['requested' => true]
);
```

```ruby
Stripe.api_key = '<<secret key>>'

capability = Stripe::Account.update_capability(
  '<<connectedAccount>>',
  'us_bank_account_ach_payments',
  {requested: true},
)
```

There can be a delay before the requested capability becomes active. If the capability has any activation requirements, the response includes them in the `requirements` arrays.

## Collect fees

When a payment is processed, your platform can take a portion of the transaction in the form of application fees. You can set application fee pricing in two ways:

- Use the [Platform Pricing Tool](https://docs.stripe.com/connect/platform-pricing-tools.md) to set and test pricing rules. This no-code feature in the Stripe Dashboard is currently only available for platforms responsible for paying Stripe fees.
- Set your pricing rules in-house, specifying application fees directly in a [PaymentIntent](https://docs.stripe.com/api/payment_intents/object.md). Fees set with this method override the pricing logic specified in the Platform Pricing Tool.

Your platform can take an application fee with the following limitations:

- The value of `application_fee_amount` must be positive and less than the amount of the charge. The application fee collected is capped at the amount of the charge.
- There are no additional Stripe fees on the application fee itself.
- In line with Brazilian regulatory and compliance requirements, platforms based outside of Brazil, with Brazilian connected accounts can’t collect application fees through Stripe.
- The currency of `application_fee_amount` depends upon a few [multiple currency](https://docs.stripe.com/connect/currencies.md) factors.

The resulting charge’s [balance transaction](https://docs.stripe.com/api.md#balance_transaction_retrieve) includes a detailed fee breakdown of both the Stripe and application fees. To provide a better reporting experience, an [Application Fee](https://docs.stripe.com/api/application_fees/object.md) is created after the fee is collected. Use the `amount` property on the application fee object for reporting. You can then access these objects with the [Application Fees](https://docs.stripe.com/api/application_fees/list.md) endpoint.

Earned application fees are added to your available account balance on the same schedule as funds from regular Stripe charges. Application fees are viewable in the [Collected fees](https://dashboard.stripe.com/connect/application_fees) section of the Dashboard.

Application fees for direct charges are created asynchronously by default. If you expand the `application_fee` object in a charge creation request, the application fee is created synchronously as part of that request. Only expand the `application_fee` object if you must, because it increases the latency of the request.

To access the application fee objects for application fees that are created asynchronously, listen for the [application_fee.created](https://docs.stripe.com/api/events/types.md#event_types-application_fee.created) webhook event.

### Flow of funds with fees

When you specify an application fee on a charge, the fee amount is transferred to your platform’s Stripe account. When processing a charge directly on the connected account, the charge amount—less the application fee—is deposited into the connected account.

For example, if you make a charge of 10 USD with a 1.23 USD application fee (like in the previous example), 1.23 USD is transferred to your platform account.

If you process payments in multiple currencies, read [how currencies are handled](https://docs.stripe.com/connect/currencies.md) in Connect.

## Set up Stripe

### Server-side

This integration requires endpoints on your server that talk to the Stripe API. Use our official libraries for access to the Stripe API from your server:

```bash
\# Available as a gem
sudo gem install stripe
```

```ruby
\# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

```bash
\# Install through pip
pip3 install --upgrade stripe
```

```bash
\# Or find the Stripe package on http://pypi.python.org/pypi/stripe/
```

```python
\# Find the version you want to pin:
# https://github.com/stripe/stripe-python/blob/master/CHANGELOG.md
# Specify that version in your requirements.txt file
stripe>=5.0.0
```

```bash
\# Install the PHP library with Composer
composer require stripe/stripe-php
```

```bash
\# Or download the source directly: https://github.com/stripe/stripe-php/releases
```

```java
/*
  For Gradle, add the following dependency to your build.gradle and replace with
  the version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
*/
implementation "com.stripe:stripe-java:29.0.0"
```

```xml
<!--
  For Maven, add the following dependency to your POM and replace with the
  version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
-->
<dependency>
  <groupId>com.stripe</groupId>
  <artifactId>stripe-java</artifactId>
  <version>29.0.0</version>
</dependency>
```

```bash
\# For other environments, manually install the following JARs:
# - The Stripe JAR from https://github.com/stripe/stripe-java/releases/latest
# - Google Gson from https://github.com/google/gson
```

```bash
\# Install with npm
npm install stripe --save
```

```bash
\# Make sure your project is using Go Modules
go mod init
# Install stripe-go
go get -u github.com/stripe/stripe-go/v82
```

```go
// Then import the package
import (
  "github.com/stripe/stripe-go/v82"
)
```

```bash
\# Install with dotnet
dotnet add package Stripe.net
dotnet restore
```

```bash
\# Or install with NuGet
Install-Package Stripe.net
```

### Client-side

Configure the SDK with your Stripe [publishable key](https://dashboard.stripe.com/test/apikeys) on app start. This enables your app to make requests to the Stripe API.

Use your [test keys](https://docs.stripe.com/keys.md#obtain-api-keys) while you test and develop, and your [live mode](https://docs.stripe.com/keys.md#test-live-modes) keys when you publish your app.

## Add an endpoint

## Integrate the payment sheet

## Set up a return URL

The customer might navigate away from your app to authenticate (for example, in Safari or their banking app). To allow them to automatically return to your app after authenticating, [configure a custom URL scheme](https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app) and set up your app delegate to forward the URL to the SDK. Stripe doesn’t support [universal links](https://developer.apple.com/documentation/xcode/allowing-apps-and-websites-to-link-to-your-content).

```swift
// This method handles opening custom URL schemes (for example, "your-app://stripe-redirect")
func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    guard let url = URLContexts.first?.url else {
        return
    }
    let stripeHandled = StripeAPI.handleURLCallback(with: url)
    if (!stripeHandled) {
        // This was not a Stripe url – handle the URL normally as you would
    }
}

```

```swift
// This method handles opening custom URL schemes (for example, "your-app://stripe-redirect")
func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
    let stripeHandled = StripeAPI.handleURLCallback(with: url)
    if (stripeHandled) {
        return true
    } else {
        // This was not a Stripe url – handle the URL normally as you would
    }
    return false
}
```

```swift
@main
struct MyApp: App {
  var body: some Scene {
    WindowGroup {
      Text("Hello, world!")
        .onOpenURL { incomingURL in
          let stripeHandled = StripeAPI.handleURLCallback(with: incomingURL)
          if (!stripeHandled) {
            // This was not a Stripe url – handle the URL normally as you would
          }
        }
    }
  }
}
```

## Handle post-payment events

Stripe sends a [payment_intent.succeeded](https://docs.stripe.com/api/events/types.md#event_types-payment_intent.succeeded) event when the payment completes. Use the [Dashboard webhook tool](https://dashboard.stripe.com/webhooks) or follow the [webhook guide](https://docs.stripe.com/webhooks/quickstart.md) to receive these events and run actions, such as sending an order confirmation email to your customer, logging the sale in a database, or starting a shipping workflow.

Listen for these events rather than waiting on a callback from the client. On the client, the customer could close the browser window or quit the app before the callback executes, and malicious clients could manipulate the response. Setting up your integration to listen for asynchronous events is what enables you to accept [different types of payment methods](https://stripe.com/payments/payment-methods-guide) with a single integration.

In addition to handling the `payment_intent.succeeded` event, we recommend handling these other events when collecting payments with the Payment Element:

| Event                                                                                                                           | Description                                                                                                                                                                                                                                                                         | Action                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [payment_intent.succeeded](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.succeeded)           | Sent when a customer successfully completes a payment.                                                                                                                                                                                                                              | Send the customer an order confirmation and _fulfill_ their order.                                                                                                              |
| [payment_intent.processing](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.processing)         | Sent when a customer successfully initiates a payment, but the payment has yet to complete. This event is most commonly sent when the customer initiates a bank debit. It’s followed by either a `payment_intent.succeeded` or `payment_intent.payment_failed` event in the future. | Send the customer an order confirmation that indicates their payment is pending. For digital goods, you might want to fulfill the order before waiting for payment to complete. |
| [payment_intent.payment_failed](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.payment_failed) | Sent when a customer attempts a payment, but the payment fails.                                                                                                                                                                                                                     | If a payment transitions from `processing` to `payment_failed`, offer the customer another attempt to pay.                                                                      |

## Test the integration

| Card number         | Scenario                                                            | How to test                                                                                           |
| ------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 4242424242424242    | The card payment succeeds and doesn’t require authentication.       | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |
| 4000002500003155    | The card payment requires _authentication_.                         | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |
| 4000000000009995    | The card is declined with a decline code like `insufficient_funds`. | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |
| 6205500000000000004 | The UnionPay card has a variable length of 13-19 digits.            | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |

| Payment method | Scenario                                                                                                                                                                   | How to test                                                                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                | Your customer fails to authenticate on the redirect page for a redirect-based and immediate notification payment method.                                                   | Choose any redirect-based payment method, fill out the required details, and confirm the payment. Then click **Fail test payment** on the redirect page. |
| Pay by Bank    | Your customer successfully pays with a redirect-based and [delayed notification](https://docs.stripe.com/payments/payment-methods.md#payment-notification) payment method. | Choose the payment method, fill out the required details, and confirm the payment. Then click **Complete test payment** on the redirect page.            |
| Pay by Bank    | Your customer fails to authenticate on the redirect page for a redirect-based and delayed notification payment method.                                                     | Choose the payment method, fill out the required details, and confirm the payment. Then click **Fail test payment** on the redirect page.                |

| Payment method    | Scenario                                                                                          | How to test                                                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEPA Direct Debit | Your customer successfully pays with SEPA Direct Debit.                                           | Fill out the form using the account number `AT321904300235473204`. The confirmed PaymentIntent initially transitions to processing, then transitions to the succeeded status three minutes later. |
| SEPA Direct Debit | Your customer’s payment intent status transitions from `processing` to `requires_payment_method`. | Fill out the form using the account number `AT861904300235473202`.                                                                                                                                |

See [Testing](https://docs.stripe.com/testing.md) for additional information to test your integration.

## Enable Apple Pay

If your checkout screen has a dedicated **Apple Pay button**, follow the [Apple Pay guide](https://docs.stripe.com/apple-pay.md#present-payment-sheet) and use `ApplePayContext` to collect payment from your Apple Pay button. You can use `PaymentSheet` to handle other payment method types.

### Register for an Apple Merchant ID

Obtain an Apple Merchant ID by [registering for a new identifier](https://developer.apple.com/account/resources/identifiers/add/merchant) on the Apple Developer website.

Fill out the form with a description and identifier. Your description is for your own records and you can modify it in the future. Stripe recommends using the name of your app as the identifier (for example, `merchant.com.{{YOUR_APP_NAME}}`).

### Create a new Apple Pay certificate

Create a certificate for your app to encrypt payment data.

Go to the [iOS Certificate Settings](https://dashboard.stripe.com/settings/ios_certificates) in the Dashboard, click **Add new application**, and follow the guide.

Download a Certificate Signing Request (CSR) file to get a secure certificate from Apple that allows you to use Apple Pay.

One CSR file must be used to issue exactly one certificate. If you switch your Apple Merchant ID, you must go to the [iOS Certificate Settings](https://dashboard.stripe.com/settings/ios_certificates) in the Dashboard to obtain a new CSR and certificate.

### Integrate with Xcode

Add the Apple Pay capability to your app. In Xcode, open your project settings, click the **Signing & Capabilities** tab, and add the **Apple Pay** capability. You might be prompted to log in to your developer account at this point. Select the merchant ID you created earlier, and your app is ready to accept Apple Pay.

![](images/mobile/ios/xcode.png)
Enable the Apple Pay capability in Xcode

### Add Apple Pay

To add Apple Pay to PaymentSheet, set [applePay](https://stripe.dev/stripe-ios/stripe-paymentsheet/Classes/PaymentSheet/Configuration.html#/s:6Stripe12PaymentSheetC13ConfigurationV8applePayAC05ApplefD0VSgvp) after initializing `PaymentSheet.Configuration` with your Apple merchant ID and the [country code of your business](https://dashboard.stripe.com/settings/account).

Per [Apple’s guidelines](https://developer.apple.com/design/human-interface-guidelines/apple-pay#Supporting-subscriptions) for recurring payments, you must also set additional attributes on the `PKPaymentRequest`. Add a handler in [ApplePayConfiguration.paymentRequestHandlers](https://stripe.dev/stripe-ios/stripepaymentsheet/documentation/stripepaymentsheet/paymentsheet/applepayconfiguration/handlers/paymentrequesthandler) to configure the [PKPaymentRequest.paymentSummaryItems](https://developer.apple.com/documentation/passkit/pkpaymentrequest/1619231-paymentsummaryitems) with the amount you intend to charge (for example, 9.95 USD a month).

You can also adopt [merchant tokens](https://developer.apple.com/apple-pay/merchant-tokens/) by setting the `recurringPaymentRequest` or `automaticReloadPaymentRequest` properties on the `PKPaymentRequest`.

To learn more about how to use recurring payments with Apple Pay, see [Apple’s PassKit documentation](https://developer.apple.com/documentation/passkit/pkpaymentrequest).

```swift
let customHandlers = PaymentSheet.ApplePayConfiguration.Handlers(
    paymentRequestHandler: { request in
        // PKRecurringPaymentSummaryItem is available on iOS 15 or later
        if #available(iOS 15.0, *) {
            let billing = PKRecurringPaymentSummaryItem(label: "My Subscription", amount: NSDecimalNumber(string: "59.99"))

            // Payment starts today
            billing.startDate = Date()

            // Payment ends in one year
            billing.endDate = Date().addingTimeInterval(60 * 60 * 24 * 365)

            // Pay once a month.
            billing.intervalUnit = .month
            billing.intervalCount = 1

            // recurringPaymentRequest is only available on iOS 16 or later
            if #available(iOS 16.0, *) {
                request.recurringPaymentRequest = PKRecurringPaymentRequest(paymentDescription: "Recurring",
                                                                            regularBilling: billing,
                                                                            managementURL: URL(string: "https://my-backend.example.com/customer-portal")!)
                request.recurringPaymentRequest?.billingAgreement = "You'll be billed $59.99 every month for the next 12 months. To cancel at any time, go to Account and click 'Cancel Membership.'"
            }
            request.paymentSummaryItems = [billing]
            request.currencyCode = "USD"
        } else {
            // On older iOS versions, set alternative summary items.
            request.paymentSummaryItems = [PKPaymentSummaryItem(label: "Monthly plan starting July 1, 2022", amount: NSDecimalNumber(string: "59.99"), type: .final)]
        }
        return request
    }
)
var configuration = PaymentSheet.Configuration()
configuration.applePay = .init(merchantId: "merchant.com.your_app_name",
                                merchantCountryCode: "US",
                                customHandlers: customHandlers)
```

### Order tracking

To add [order tracking](https://developer.apple.com/design/human-interface-guidelines/technologies/wallet/designing-order-tracking) information in iOS 16 or later, configure an [authorizationResultHandler](https://stripe.dev/stripe-ios/stripepaymentsheet/documentation/stripepaymentsheet/paymentsheet/applepayconfiguration/handlers/authorizationresulthandler) in your `PaymentSheet.ApplePayConfiguration.Handlers`. Stripe calls your implementation after the payment is complete, but before iOS dismisses the Apple Pay sheet.

In your `authorizationResultHandler` implementation, fetch the order details from your server for the completed order. Add the details to the provided [PKPaymentAuthorizationResult](https://developer.apple.com/documentation/passkit/pkpaymentauthorizationresult) and call the provided completion handler.

To learn more about order tracking, see [Apple’s Wallet Orders documentation](https://developer.apple.com/documentation/walletorders).

```swift
let customHandlers = PaymentSheet.ApplePayConfiguration.Handlers(
    authorizationResultHandler: { result, completion in
        // Fetch the order details from your service
        MyAPIClient.shared.fetchOrderDetails(orderID: orderID) { myOrderDetails
            result.orderDetails = PKPaymentOrderDetails(
                orderTypeIdentifier: myOrderDetails.orderTypeIdentifier, // "com.myapp.order"
                orderIdentifier: myOrderDetails.orderIdentifier, // "ABC123-AAAA-1111"
                webServiceURL: myOrderDetails.webServiceURL, // "https://my-backend.example.com/apple-order-tracking-backend"
                authenticationToken: myOrderDetails.authenticationToken) // "abc123"
            // Call the completion block on the main queue with your modified PKPaymentAuthorizationResult
            completion(result)
        }
    }
)
var configuration = PaymentSheet.Configuration()
configuration.applePay = .init(merchantId: "merchant.com.your_app_name",
                               merchantCountryCode: "US",
                               customHandlers: customHandlers)
```

## Enable card scanning

To enable card scanning support, set the `NSCameraUsageDescription` (**Privacy - Camera Usage Description**) in the Info.plist of your application, and provide a reason for accessing the camera (for example, “To scan cards”). Devices with iOS 13 or higher support card scanning.

## Customize the sheet

All customization is configured through the [PaymentSheet.Configuration](https://stripe.dev/stripe-ios/stripe-paymentsheet/Classes/PaymentSheet/Configuration.html) object.

### Appearance

Customize colors, fonts, and so on to match the look and feel of your app by using the [appearance API](https://docs.stripe.com/elements/appearance-api.md?platform=ios).

### Payment method layout

Configure the layout of payment methods in the sheet using [paymentMethodLayout](https://stripe.dev/stripe-ios/stripepaymentsheet/documentation/stripepaymentsheet/paymentsheet/configuration-swift.struct/paymentmethodlayout). You can display them horizontally, vertically, or let Stripe optimize the layout automatically.

![](images/mobile/payment-sheet/ios-mpe-payment-method-layouts.png)

```swift
var configuration = PaymentSheet.Configuration()
configuration.paymentMethodLayout = .automatic
```

### Collect users addresses

Collect local and international shipping or billing addresses from your customers using the [Address Element](https://docs.stripe.com/elements/address-element.md?platform=ios).

### Merchant display name

Specify a customer-facing business name by setting [merchantDisplayName](https://stripe.dev/stripe-ios/stripe-paymentsheet/Classes/PaymentSheet/Configuration.html#/s:18StripePaymentSheet0bC0C13ConfigurationV19merchantDisplayNameSSvp). By default, this is your app’s name.

```swift
var configuration = PaymentSheet.Configuration()
configuration.merchantDisplayName = "My app, Inc."
```

### Dark mode

`PaymentSheet` automatically adapts to the user’s system-wide appearance settings (light and dark mode). If your app doesn’t support dark mode, you can set [style](https://stripe.dev/stripe-ios/stripe-paymentsheet/Classes/PaymentSheet/Configuration.html#/s:18StripePaymentSheet0bC0C13ConfigurationV5styleAC18UserInterfaceStyleOvp) to `alwaysLight` or `alwaysDark` mode.

```swift
var configuration = PaymentSheet.Configuration()
configuration.style = .alwaysLight
```

## Complete payment in your UI

You can present the Payment Sheet to only collect payment method details and then later call a `confirm` method to complete payment in your app’s UI. This is useful if you have a custom buy button or require additional steps after you collect payment details.

![](images/mobile/payment-sheet/ios-multi-step.png)
Complete the payment in your app’s UI

The following steps walk you through how to complete payment in your app’s UI. See our sample integration out on [GitHub](https://github.com/stripe/stripe-ios/blob/master/Example/PaymentSheet%20Example/PaymentSheet%20Example/ExampleCustomCheckoutViewController.swift).

1. First, initialize [PaymentSheet.FlowController](https://stripe.dev/stripe-ios/stripepaymentsheet/documentation/stripepaymentsheet/paymentsheet/flowcontroller) instead of `PaymentSheet` and update your UI with its `paymentOption` property. This property contains an image and label representing the customer’s initially selected, default payment method.

```swift
PaymentSheet.FlowController.create(paymentIntentClientSecret: paymentIntentClientSecret, configuration: configuration) { [weak self] result in
  switch result {
  case .failure(let error):
    print(error)
  case .success(let paymentSheetFlowController):
    self?.paymentSheetFlowController = paymentSheetFlowController
    // Update your UI using paymentSheetFlowController.paymentOption
  }
}
```

1. Next, call `presentPaymentOptions` to collect payment details. When completed, update your UI again with the `paymentOption` property.

```swift
paymentSheetFlowController.presentPaymentOptions(from: self) {
  // Update your UI using paymentSheetFlowController.paymentOption
}
```

1. Finally, call `confirm`.

```swift
paymentSheetFlowController.confirm(from: self) { paymentResult in
  // MARK: Handle the payment result
  switch paymentResult {
  case .completed:
    print("Payment complete!")
  case .canceled:
    print("Canceled!")
  case .failed(let error):
    print(error)
  }
}
```

The following steps walk you through how to complete payment in your app’s UI. See our sample integration out on [GitHub](https://github.com/stripe/stripe-ios/blob/master/Example/PaymentSheet%20Example/PaymentSheet%20Example/ExampleSwiftUICustomPaymentFlow.swift).

1. First, initialize [PaymentSheet.FlowController](https://stripe.dev/stripe-ios/stripepaymentsheet/documentation/stripepaymentsheet/paymentsheet/flowcontroller) instead of `PaymentSheet`. Its `paymentOption` property contains an image and label representing the customer’s currently selected payment method, which you can use in your UI.

```swift
PaymentSheet.FlowController.create(paymentIntentClientSecret: paymentIntentClientSecret, configuration: configuration) { [weak self] result in
  switch result {
  case .failure(let error):
    print(error)
  case .success(let paymentSheetFlowController):
    self?.paymentSheetFlowController = paymentSheetFlowController
    // Use the paymentSheetFlowController.paymentOption properties in your UI
    myPaymentMethodLabel = paymentSheetFlowController.paymentOption?.label ?? "Select a payment method"
    myPaymentMethodImage = paymentSheetFlowController.paymentOption?.image ?? UIImage(systemName: "square.and.pencil")!
  }
}
```

1. Use [PaymentSheet.FlowController.PaymentOptionsButton](https://stripe.dev/stripe-ios/stripepaymentsheet/documentation/stripepaymentsheet/paymentsheet/flowcontroller/paymentoptionsbutton) to wrap the button that presents the sheet to collect payment details. When `PaymentSheet.FlowController` calls the `onSheetDismissed` argument, the `paymentOption` for the `PaymentSheet.FlowController` instance reflects the currently selected payment method.

```swift
PaymentSheet.FlowController.PaymentOptionsButton(
  paymentSheetFlowController: paymentSheetFlowController,
  onSheetDismissed: {
    myPaymentMethodLabel = paymentSheetFlowController.paymentOption?.label ?? "Select a payment method"
    myPaymentMethodImage = paymentSheetFlowController.paymentOption?.image ?? UIImage(systemName: "square.and.pencil")!
  },
  content: {
    /* An example button */
    HStack {
      Text(myPaymentMethodLabel)
      Image(uiImage: myPaymentMethodImage)
    }
  }
)
```

1. Use [PaymentSheet.FlowController.PaymentOptionsButton](https://stripe.dev/stripe-ios/stripepaymentsheet/documentation/stripepaymentsheet/paymentsheet/flowcontroller/paymentoptionsbutton) to wrap the button that confirms the payment.

```swift
PaymentSheet.FlowController.ConfirmButton(
  paymentSheetFlowController: paymentSheetFlowController,
  onCompletion: { result in
    // MARK: Handle the payment result
    switch result {
    case .completed:
      print("Payment complete!")
    case .canceled:
      print("Canceled!")
    case .failed(let error):
      print(error)
    }
  },
  content: {
    /* An example button */
    Text("Pay")
  }
)
```

Setting `allowsDelayedPaymentMethods` to true allows [delayed notification](https://docs.stripe.com/payments/payment-methods.md#payment-notification) payment methods like US bank accounts. For these payment methods, the final payment status isn’t known when the `PaymentSheet` completes, and instead succeeds or fails later. If you support these types of payment methods, inform the customer their order is confirmed and only fulfill their order (for example, ship their product) when the payment is successful.

## Enable additional payment methods

Navigate to [Manage payment methods for your connected accounts](https://dashboard.stripe.com/settings/payment_methods/connected_accounts) in the Dashboard to configure which payment methods your connected accounts accept. Changes to default settings apply to all new and existing connected accounts.

Consult the following resources for payment method information:

- [A guide to payment methods](https://stripe.com/payments/payment-methods-guide#choosing-the-right-payment-methods-for-your-business) to help you choose the correct payment methods for your platform.
- [Account capabilities](https://docs.stripe.com/connect/account-capabilities.md) to make sure your chosen payment methods work for your connected accounts.
- [Payment method and product support](https://docs.stripe.com/payments/payment-methods/payment-method-support.md#product-support) tables to make sure your chosen payment methods work for your Stripe products and payments flows.

For each payment method, you can select one of the following dropdown options:

| |
| |
| **On by default** | Your connected accounts accept this payment method during checkout. Some payment methods can only be off or blocked. This is because your connected accounts with _access to the Stripe Dashboard_ must activate them in their settings page. |
| **Off by default** | Your connected accounts don’t accept this payment method during checkout. If you allow your connected accounts with _access to the Stripe Dashboard_ to manage their own payment methods, they have the ability to turn it on. |
| **Blocked** | Your connected accounts don’t accept this payment method during checkout. If you allow your connected accounts with _access to the Stripe Dashboard_ to manage their own payment methods, they don’t have the option to turn it on. |

![Dropdown options for payment methods, each showing an available option (blocked, on by default, off by default)](images/connect/payment-methods/dropdowns.png)
Payment method options

If you make a change to a payment method, you must click **Review changes** in the bottom bar of your screen and **Save and apply** to update your connected accounts.

![Dialog that shows after clicking Save button with a list of what the user changed](images/connect/payment-methods/dialog.png)
Save dialog

### Allow connected accounts to manage payment methods

Stripe recommends allowing your connected accounts to customize their own payment methods. This option allows each connected account with _access to the Stripe Dashboard_ to view and update their [Payment methods](https://dashboard.stripe.com/settings/payment_methods) page. Only owners of the connected accounts can customize their payment methods. The Stripe Dashboard displays the set of payment method defaults you applied to all new and existing connected accounts. Your connected accounts can override these defaults, excluding payment methods you have blocked.

Check the **Account customization** checkbox to enable this option. You must click **Review changes** in the bottom bar of your screen and then select **Save and apply** to update this setting.

![Screenshot of the checkbox to select when allowing connected owners to customize payment methods](images/connect/payment-methods/checkbox.png)
Account customization checkbox

### Payment method capabilities

To allow your connected accounts to accept additional payment methods, you must make sure their connected accounts have active [capabilities for each payment method](https://docs.stripe.com/connect/account-capabilities.md#payment-methods). Most payment methods have the same verification requirements as the `card_payments` capability, with some restrictions and exceptions. The payment method capabilities table lists the payment methods that require additional verification over cards.

Navigate to the [Connected account payment settings](https://dashboard.stripe.com/settings/payment_methods/connected_accounts) in the Dashboard to request capabilities on your new and existing connected accounts for each payment method and country combination.

For an existing connected account, you can [list](https://docs.stripe.com/api/capabilities/list.md) their existing capabilities to determine whether you need to request additional capabilities.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var service = new AccountCapabilityService();
StripeList<Capability> capabilities = service.List("<<connectedAccount>>");
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CapabilityListParams{Account: stripe.String("<<connectedAccount>>")};
result := capability.List(params);
```

```java
Stripe.apiKey = "<<secret key>>";

Account resource = Account.retrieve("<<connectedAccount>>");

AccountCapabilitiesParams params = AccountCapabilitiesParams.builder().build();

CapabilityCollection capabilities = resource.capabilities(params);
```

```node
const stripe = require("stripe")("<<secret key>>");

const capabilities = await stripe.accounts.listCapabilities("<<connectedAccount>>");
```

```python
import stripe
stripe.api_key = "<<secret key>>"

capabilities = stripe.Account.list_capabilities("<<connectedAccount>>")
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$capabilities = $stripe->accounts->allCapabilities('<<connectedAccount>>', []);
```

```ruby
Stripe.api_key = '<<secret key>>'

capabilities = Stripe::Account.list_capabilities('<<connectedAccount>>')
```

Request additional capabilities by [updating](https://docs.stripe.com/api/capabilities/update.md) each connected account’s capabilities.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new AccountCapabilityUpdateOptions { Requested = true };
var service = new AccountCapabilityService();
Capability capability = service.Update(
    "<<connectedAccount>>",
    "us_bank_account_ach_payments",
    options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CapabilityParams{
  Requested: stripe.Bool(true),
  Account: stripe.String("<<connectedAccount>>"),
};
result, err := capability.Update("us_bank_account_ach_payments", params);
```

```java
Stripe.apiKey = "<<secret key>>";

Account account = Account.retrieve("<<connectedAccount>>");

Capability resource = account.capabilities().retrieve("us_bank_account_ach_payments");

CapabilityUpdateParams params = CapabilityUpdateParams.builder().setRequested(true).build();

Capability capability = resource.update(params);
```

```node
const stripe = require("stripe")("<<secret key>>");

const capability = await stripe.accounts.updateCapability(
  "<<connectedAccount>>",
  "us_bank_account_ach_payments",
  {
    requested: true,
  }
);
```

```python
import stripe
stripe.api_key = "<<secret key>>"

capability = stripe.Account.modify_capability(
  "<<connectedAccount>>",
  "us_bank_account_ach_payments",
  requested=True,
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$capability = $stripe->accounts->updateCapability(
  '<<connectedAccount>>',
  'us_bank_account_ach_payments',
  ['requested' => true]
);
```

```ruby
Stripe.api_key = '<<secret key>>'

capability = Stripe::Account.update_capability(
  '<<connectedAccount>>',
  'us_bank_account_ach_payments',
  {requested: true},
)
```

There can be a delay before the requested capability becomes active. If the capability has any activation requirements, the response includes them in the `requirements` arrays.

## Collect fees

When a payment is processed, your platform can take a portion of the transaction in the form of application fees. You can set application fee pricing in two ways:

- Use the [Platform Pricing Tool](https://docs.stripe.com/connect/platform-pricing-tools.md) to set and test pricing rules. This no-code feature in the Stripe Dashboard is currently only available for platforms responsible for paying Stripe fees.
- Set your pricing rules in-house, specifying application fees directly in a [PaymentIntent](https://docs.stripe.com/api/payment_intents/object.md). Fees set with this method override the pricing logic specified in the Platform Pricing Tool.

Your platform can take an application fee with the following limitations:

- The value of `application_fee_amount` must be positive and less than the amount of the charge. The application fee collected is capped at the amount of the charge.
- There are no additional Stripe fees on the application fee itself.
- In line with Brazilian regulatory and compliance requirements, platforms based outside of Brazil, with Brazilian connected accounts can’t collect application fees through Stripe.
- The currency of `application_fee_amount` depends upon a few [multiple currency](https://docs.stripe.com/connect/currencies.md) factors.

The resulting charge’s [balance transaction](https://docs.stripe.com/api.md#balance_transaction_retrieve) includes a detailed fee breakdown of both the Stripe and application fees. To provide a better reporting experience, an [Application Fee](https://docs.stripe.com/api/application_fees/object.md) is created after the fee is collected. Use the `amount` property on the application fee object for reporting. You can then access these objects with the [Application Fees](https://docs.stripe.com/api/application_fees/list.md) endpoint.

Earned application fees are added to your available account balance on the same schedule as funds from regular Stripe charges. Application fees are viewable in the [Collected fees](https://dashboard.stripe.com/connect/application_fees) section of the Dashboard.

Application fees for direct charges are created asynchronously by default. If you expand the `application_fee` object in a charge creation request, the application fee is created synchronously as part of that request. Only expand the `application_fee` object if you must, because it increases the latency of the request.

To access the application fee objects for application fees that are created asynchronously, listen for the [application_fee.created](https://docs.stripe.com/api/events/types.md#event_types-application_fee.created) webhook event.

### Flow of funds with fees

When you specify an application fee on a charge, the fee amount is transferred to your platform’s Stripe account. When processing a charge directly on the connected account, the charge amount—less the application fee—is deposited into the connected account.

For example, if you make a charge of 10 USD with a 1.23 USD application fee (like in the previous example), 1.23 USD is transferred to your platform account.

If you process payments in multiple currencies, read [how currencies are handled](https://docs.stripe.com/connect/currencies.md) in Connect.

## Set up Stripe

### Server-side

This integration requires endpoints on your server that talk to the Stripe API. Use the official libraries for access to the Stripe API from your server:

```bash
\# Available as a gem
sudo gem install stripe
```

```ruby
\# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

```bash
\# Install through pip
pip3 install --upgrade stripe
```

```bash
\# Or find the Stripe package on http://pypi.python.org/pypi/stripe/
```

```python
\# Find the version you want to pin:
# https://github.com/stripe/stripe-python/blob/master/CHANGELOG.md
# Specify that version in your requirements.txt file
stripe>=5.0.0
```

```bash
\# Install the PHP library with Composer
composer require stripe/stripe-php
```

```bash
\# Or download the source directly: https://github.com/stripe/stripe-php/releases
```

```java
/*
  For Gradle, add the following dependency to your build.gradle and replace with
  the version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
*/
implementation "com.stripe:stripe-java:29.0.0"
```

```xml
<!--
  For Maven, add the following dependency to your POM and replace with the
  version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
-->
<dependency>
  <groupId>com.stripe</groupId>
  <artifactId>stripe-java</artifactId>
  <version>29.0.0</version>
</dependency>
```

```bash
\# For other environments, manually install the following JARs:
# - The Stripe JAR from https://github.com/stripe/stripe-java/releases/latest
# - Google Gson from https://github.com/google/gson
```

```bash
\# Install with npm
npm install stripe --save
```

```bash
\# Make sure your project is using Go Modules
go mod init
# Install stripe-go
go get -u github.com/stripe/stripe-go/v82
```

```go
// Then import the package
import (
  "github.com/stripe/stripe-go/v82"
)
```

```bash
\# Install with dotnet
dotnet add package Stripe.net
dotnet restore
```

```bash
\# Or install with NuGet
Install-Package Stripe.net
```

### Client-side

```kotlin
plugins {
    id("com.android.application")
}


dependencies {
  // ...

}
```

```groovy
apply plugin: 'com.android.application'

android { ... }

dependencies {
  // ...

}
```

For details on the latest SDK release and past versions, see the [Releases](https://github.com/stripe/stripe-android/releases) page on GitHub. To receive notifications when a new release is published, [watch releases for the repository](https://docs.github.com/en/github/managing-subscriptions-and-notifications-on-github/configuring-notifications#configuring-your-watch-settings-for-an-individual-repository).

## Add an endpoint

## Integrate the payment sheet

## Handle post-payment events

Stripe sends a [payment_intent.succeeded](https://docs.stripe.com/api/events/types.md#event_types-payment_intent.succeeded) event when the payment completes. Use the [Dashboard webhook tool](https://dashboard.stripe.com/webhooks) or follow the [webhook guide](https://docs.stripe.com/webhooks/quickstart.md) to receive these events and run actions, such as sending an order confirmation email to your customer, logging the sale in a database, or starting a shipping workflow.

Listen for these events rather than waiting on a callback from the client. On the client, the customer could close the browser window or quit the app before the callback executes, and malicious clients could manipulate the response. Setting up your integration to listen for asynchronous events is what enables you to accept [different types of payment methods](https://stripe.com/payments/payment-methods-guide) with a single integration.

In addition to handling the `payment_intent.succeeded` event, we recommend handling these other events when collecting payments with the Payment Element:

| Event                                                                                                                           | Description                                                                                                                                                                                                                                                                         | Action                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [payment_intent.succeeded](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.succeeded)           | Sent when a customer successfully completes a payment.                                                                                                                                                                                                                              | Send the customer an order confirmation and _fulfill_ their order.                                                                                                              |
| [payment_intent.processing](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.processing)         | Sent when a customer successfully initiates a payment, but the payment has yet to complete. This event is most commonly sent when the customer initiates a bank debit. It’s followed by either a `payment_intent.succeeded` or `payment_intent.payment_failed` event in the future. | Send the customer an order confirmation that indicates their payment is pending. For digital goods, you might want to fulfill the order before waiting for payment to complete. |
| [payment_intent.payment_failed](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.payment_failed) | Sent when a customer attempts a payment, but the payment fails.                                                                                                                                                                                                                     | If a payment transitions from `processing` to `payment_failed`, offer the customer another attempt to pay.                                                                      |

## Test the integration

| Card number         | Scenario                                                            | How to test                                                                                           |
| ------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 4242424242424242    | The card payment succeeds and doesn’t require authentication.       | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |
| 4000002500003155    | The card payment requires _authentication_.                         | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |
| 4000000000009995    | The card is declined with a decline code like `insufficient_funds`. | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |
| 6205500000000000004 | The UnionPay card has a variable length of 13-19 digits.            | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |

| Payment method | Scenario                                                                                                                                                                   | How to test                                                                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                | Your customer fails to authenticate on the redirect page for a redirect-based and immediate notification payment method.                                                   | Choose any redirect-based payment method, fill out the required details, and confirm the payment. Then click **Fail test payment** on the redirect page. |
| Pay by Bank    | Your customer successfully pays with a redirect-based and [delayed notification](https://docs.stripe.com/payments/payment-methods.md#payment-notification) payment method. | Choose the payment method, fill out the required details, and confirm the payment. Then click **Complete test payment** on the redirect page.            |
| Pay by Bank    | Your customer fails to authenticate on the redirect page for a redirect-based and delayed notification payment method.                                                     | Choose the payment method, fill out the required details, and confirm the payment. Then click **Fail test payment** on the redirect page.                |

| Payment method    | Scenario                                                                                          | How to test                                                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEPA Direct Debit | Your customer successfully pays with SEPA Direct Debit.                                           | Fill out the form using the account number `AT321904300235473204`. The confirmed PaymentIntent initially transitions to processing, then transitions to the succeeded status three minutes later. |
| SEPA Direct Debit | Your customer’s payment intent status transitions from `processing` to `requires_payment_method`. | Fill out the form using the account number `AT861904300235473202`.                                                                                                                                |

See [Testing](https://docs.stripe.com/testing.md) for additional information to test your integration.

## Enable Google Pay

### Set up your integration

To use Google Pay, first enable the Google Pay API by adding the following to the `<application>` tag of your **AndroidManifest.xml**:

```xml
<application>
  ...
  <meta-data
    android:name="com.google.android.gms.wallet.api.enabled"
    android:value="true" />
</application>
```

For more details, see Google Pay’s [Set up Google Pay API](https://developers.google.com/pay/api/android/guides/setup) for Android.

### Add Google Pay

### Test Google Pay

Google allows you to make test payments through their [Test card suite](https://developers.google.com/pay/api/android/guides/resources/test-card-suite). The test suite supports using stripe [test cards](https://docs.stripe.com/testing.md).

You can test Google Pay using a physical Android device. Make sure you have a device in a country where google pay is supported and log in to a Google account on your test device with a real card saved to Google Wallet.

## Customize the sheet

All customization is configured using the [PaymentSheet.Configuration](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/-configuration/index.html) object.

### Appearance

Customize colors, fonts, and more to match the look and feel of your app by using the [appearance API](https://docs.stripe.com/elements/appearance-api.md?platform=android).

### Payment method layout

Configure the layout of payment methods in the sheet using [paymentMethodLayout](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/-configuration/-builder/index.html#2123253356%2FFunctions%2F2002900378). You can display them horizontally, vertically, or let Stripe optimize the layout automatically.

![](images/mobile/payment-sheet/android-mpe-payment-method-layouts.png)

```kotlin
PaymentSheet.Configuration.Builder("Example, Inc.")
  .paymentMethodLayout(PaymentSheet.PaymentMethodLayout.Automatic)
  .build()
```

```java
new PaymentSheet.Configuration.Builder("Example, Inc.")
  .paymentMethodLayout(PaymentSheet.PaymentMethodLayout.Automatic)
  .build();
```

### Collect users addresses

Collect local and international shipping or billing addresses from your customers using the [Address Element](https://docs.stripe.com/elements/address-element.md?platform=android).

### Business display name

Specify a customer-facing business name by setting [merchantDisplayName](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/-configuration/index.html#-191101533%2FProperties%2F2002900378). By default, this is your app’s name.

```kotlin
PaymentSheet.Configuration.Builder(
  merchantDisplayName = "My app, Inc."
).build()
```

```java
new PaymentSheet.Configuration.Builder("My app, Inc.")
  .build();
```

### Dark mode

By default, `PaymentSheet` automatically adapts to the user’s system-wide appearance settings (light and dark mode). You can change this by setting light or dark mode on your app:

```kotlin
// force dark
AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
// force light
AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
```

```java
// force dark
AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
// force light
AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
```

## Complete payment in your UI

You can present Payment Sheet to only collect payment method details and complete the payment back in your app’s UI. This is useful if you have a custom buy button or require additional steps after payment details are collected.

![](images/mobile/payment-sheet/android-multi-step.png)

A sample integration is [available on our GitHub](https://github.com/stripe/stripe-android/blob/master/paymentsheet-example/src/main/java/com/stripe/android/paymentsheet/example/samples/ui/custom_flow/CustomFlowActivity.kt).

1. First, initialize [PaymentSheet.FlowController](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/-flow-controller/index.html) instead of `PaymentSheet` using one of the [Builder](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/-flow-controller/-builder/index.html) methods.

```kotlin
class CheckoutActivity : AppCompatActivity() {
  private lateinit var flowController: PaymentSheet.FlowController

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    flowController = PaymentSheet.FlowController.Builder(
      paymentResultCallback = ::onPaymentSheetResult,
      paymentOptionCallback = ::onPaymentOption,
    ).build(this)
  }
}
```

```java
public class CheckoutActivity extends AppCompatActivity {
  private PaymentSheet.FlowController flowController;

  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    final PaymentOptionCallback paymentOptionCallback = paymentOption -> {
      onPaymentOption(paymentOption);
    };

    final PaymentSheetResultCallback paymentSheetResultCallback = paymentSheetResult -> {
      onPaymentSheetResult(paymentSheetResult);
    };

    flowController = new PaymentSheet.FlowController.Builder(
      paymentSheetResultCallback,
      paymentOptionCallback
    ).build(this);
  }
}
```

2. Next, call `configureWithPaymentIntent` with the Stripe object keys fetched from your backend and update your UI in the callback using [getPaymentOption()](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/-flow-controller/index.html#-2091462043%2FFunctions%2F2002900378). This contains an image and label representing the customer’s currently selected payment method.

```kotlin
flowController.configureWithPaymentIntent(
  paymentIntentClientSecret = paymentIntentClientSecret,
  configuration = PaymentSheet.Configuration.Builder("Example, Inc.")
    .customer(PaymentSheet.CustomerConfiguration(
      id = customerId,
      ephemeralKeySecret = ephemeralKeySecret
    ))
    .build()
) { isReady, error ->
  if (isReady) {
    // Update your UI using `flowController.getPaymentOption()`
  } else {
    // handle FlowController configuration failure
  }
}
```

```java
flowController.configureWithPaymentIntent(
  paymentIntentClientSecret,
  new PaymentSheet.Configuration.Builder("Example, Inc.")
    .customer(new PaymentSheet.CustomerConfiguration(
      customerId,
      ephemeralKeySecret
    ))
    .build(),
  (success, error) -> {
    if (success) {
      // Update your UI using `flowController.getPaymentOption()`
    } else {
      // handle FlowController configuration failure
    }
  }
);
```

3. Next, call [presentPaymentOptions](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/-flow-controller/index.html#449924733%2FFunctions%2F2002900378) to collect payment details. When the customer finishes, the sheet is dismissed and calls the [paymentOptionCallback](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-option-callback/index.html) passed earlier in `create`. Implement this method to update your UI with the returned `paymentOption`.

```kotlin
// ...
  flowController.presentPaymentOptions()
// ...
  private fun onPaymentOption(paymentOption: PaymentOption?) {
    if (paymentOption != null) {
      paymentMethodButton.text = paymentOption.label
      paymentMethodButton.setCompoundDrawablesRelativeWithIntrinsicBounds(
        paymentOption.drawableResourceId,
        0,
        0,
        0
      )
    } else {
      paymentMethodButton.text = "Select"
      paymentMethodButton.setCompoundDrawablesRelativeWithIntrinsicBounds(
        null,
        null,
        null,
        null
      )
    }
  }
```

```java
// ...
    flowController.presentPaymentOptions());
// ...
  private void onPaymentOption(
    @Nullable PaymentOption paymentOption
  ) {
    if (paymentOption != null) {
      paymentMethodButton.setText(paymentOption.getLabel());
      paymentMethodButton.setCompoundDrawablesRelativeWithIntrinsicBounds(
        paymentOption.getDrawableResourceId(),
        0,
        0,
        0
      );
    } else {
      paymentMethodButton.setText("Select");
      paymentMethodButton.setCompoundDrawablesRelativeWithIntrinsicBounds(
        null,
        null,
        null,
        null
      );
    }
  }

  private void onCheckout() {
    // see below
  }
}
```

4. Finally, call [confirm](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet/-flow-controller/index.html#-479056656%2FFunctions%2F2002900378) to complete the payment. When the customer finishes, the sheet is dismissed and calls the [paymentResultCallback](https://stripe.dev/stripe-android/paymentsheet/com.stripe.android.paymentsheet/-payment-sheet-result-callback/index.html#237248767%2FFunctions%2F2002900378) passed earlier in `create`.

```kotlin
// ...
    flowController.confirmPayment()
  // ...

  private fun onPaymentSheetResult(
    paymentSheetResult: PaymentSheetResult
  ) {
    when (paymentSheetResult) {
      is PaymentSheetResult.Canceled -> {
        // Payment canceled
      }
      is PaymentSheetResult.Failed -> {
        // Payment Failed. See logcat for details or inspect paymentSheetResult.error
      }
      is PaymentSheetResult.Completed -> {
        // Payment Complete
      }
    }
  }
```

```java
// ...
    flowController.confirmPayment();
  // ...

  private void onPaymentSheetResult(
    final PaymentSheetResult paymentSheetResult
  ) {
    if (paymentSheetResult instanceof PaymentSheetResult.Canceled) {
      // Payment Canceled
    } else if (paymentSheetResult instanceof PaymentSheetResult.Failed) {
      // Payment Failed. See logcat for details or inspect paymentSheetResult.getError()
    } else if (paymentSheetResult instanceof PaymentSheetResult.Completed) {
      // Payment Complete
    }
  }
```

Setting `allowsDelayedPaymentMethods` to true allows [delayed notification](https://docs.stripe.com/payments/payment-methods.md#payment-notification) payment methods like US bank accounts. For these payment methods, the final payment status isn’t known when the `PaymentSheet` completes, and instead succeeds or fails later. If you support these types of payment methods, inform the customer their order is confirmed and only fulfill their order (for example, ship their product) when the payment is successful.

## Enable additional payment methods

Navigate to [Manage payment methods for your connected accounts](https://dashboard.stripe.com/settings/payment_methods/connected_accounts) in the Dashboard to configure which payment methods your connected accounts accept. Changes to default settings apply to all new and existing connected accounts.

Consult the following resources for payment method information:

- [A guide to payment methods](https://stripe.com/payments/payment-methods-guide#choosing-the-right-payment-methods-for-your-business) to help you choose the correct payment methods for your platform.
- [Account capabilities](https://docs.stripe.com/connect/account-capabilities.md) to make sure your chosen payment methods work for your connected accounts.
- [Payment method and product support](https://docs.stripe.com/payments/payment-methods/payment-method-support.md#product-support) tables to make sure your chosen payment methods work for your Stripe products and payments flows.

For each payment method, you can select one of the following dropdown options:

| |
| |
| **On by default** | Your connected accounts accept this payment method during checkout. Some payment methods can only be off or blocked. This is because your connected accounts with _access to the Stripe Dashboard_ must activate them in their settings page. |
| **Off by default** | Your connected accounts don’t accept this payment method during checkout. If you allow your connected accounts with _access to the Stripe Dashboard_ to manage their own payment methods, they have the ability to turn it on. |
| **Blocked** | Your connected accounts don’t accept this payment method during checkout. If you allow your connected accounts with _access to the Stripe Dashboard_ to manage their own payment methods, they don’t have the option to turn it on. |

![Dropdown options for payment methods, each showing an available option (blocked, on by default, off by default)](images/connect/payment-methods/dropdowns.png)
Payment method options

If you make a change to a payment method, you must click **Review changes** in the bottom bar of your screen and **Save and apply** to update your connected accounts.

![Dialog that shows after clicking Save button with a list of what the user changed](images/connect/payment-methods/dialog.png)
Save dialog

### Allow connected accounts to manage payment methods

Stripe recommends allowing your connected accounts to customize their own payment methods. This option allows each connected account with _access to the Stripe Dashboard_ to view and update their [Payment methods](https://dashboard.stripe.com/settings/payment_methods) page. Only owners of the connected accounts can customize their payment methods. The Stripe Dashboard displays the set of payment method defaults you applied to all new and existing connected accounts. Your connected accounts can override these defaults, excluding payment methods you have blocked.

Check the **Account customization** checkbox to enable this option. You must click **Review changes** in the bottom bar of your screen and then select **Save and apply** to update this setting.

![Screenshot of the checkbox to select when allowing connected owners to customize payment methods](images/connect/payment-methods/checkbox.png)
Account customization checkbox

### Payment method capabilities

To allow your connected accounts to accept additional payment methods, you must make sure their connected accounts have active [capabilities for each payment method](https://docs.stripe.com/connect/account-capabilities.md#payment-methods). Most payment methods have the same verification requirements as the `card_payments` capability, with some restrictions and exceptions. The payment method capabilities table lists the payment methods that require additional verification over cards.

Navigate to the [Connected account payment settings](https://dashboard.stripe.com/settings/payment_methods/connected_accounts) in the Dashboard to request capabilities on your new and existing connected accounts for each payment method and country combination.

For an existing connected account, you can [list](https://docs.stripe.com/api/capabilities/list.md) their existing capabilities to determine whether you need to request additional capabilities.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var service = new AccountCapabilityService();
StripeList<Capability> capabilities = service.List("<<connectedAccount>>");
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CapabilityListParams{Account: stripe.String("<<connectedAccount>>")};
result := capability.List(params);
```

```java
Stripe.apiKey = "<<secret key>>";

Account resource = Account.retrieve("<<connectedAccount>>");

AccountCapabilitiesParams params = AccountCapabilitiesParams.builder().build();

CapabilityCollection capabilities = resource.capabilities(params);
```

```node
const stripe = require("stripe")("<<secret key>>");

const capabilities = await stripe.accounts.listCapabilities("<<connectedAccount>>");
```

```python
import stripe
stripe.api_key = "<<secret key>>"

capabilities = stripe.Account.list_capabilities("<<connectedAccount>>")
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$capabilities = $stripe->accounts->allCapabilities('<<connectedAccount>>', []);
```

```ruby
Stripe.api_key = '<<secret key>>'

capabilities = Stripe::Account.list_capabilities('<<connectedAccount>>')
```

Request additional capabilities by [updating](https://docs.stripe.com/api/capabilities/update.md) each connected account’s capabilities.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new AccountCapabilityUpdateOptions { Requested = true };
var service = new AccountCapabilityService();
Capability capability = service.Update(
    "<<connectedAccount>>",
    "us_bank_account_ach_payments",
    options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CapabilityParams{
  Requested: stripe.Bool(true),
  Account: stripe.String("<<connectedAccount>>"),
};
result, err := capability.Update("us_bank_account_ach_payments", params);
```

```java
Stripe.apiKey = "<<secret key>>";

Account account = Account.retrieve("<<connectedAccount>>");

Capability resource = account.capabilities().retrieve("us_bank_account_ach_payments");

CapabilityUpdateParams params = CapabilityUpdateParams.builder().setRequested(true).build();

Capability capability = resource.update(params);
```

```node
const stripe = require("stripe")("<<secret key>>");

const capability = await stripe.accounts.updateCapability(
  "<<connectedAccount>>",
  "us_bank_account_ach_payments",
  {
    requested: true,
  }
);
```

```python
import stripe
stripe.api_key = "<<secret key>>"

capability = stripe.Account.modify_capability(
  "<<connectedAccount>>",
  "us_bank_account_ach_payments",
  requested=True,
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$capability = $stripe->accounts->updateCapability(
  '<<connectedAccount>>',
  'us_bank_account_ach_payments',
  ['requested' => true]
);
```

```ruby
Stripe.api_key = '<<secret key>>'

capability = Stripe::Account.update_capability(
  '<<connectedAccount>>',
  'us_bank_account_ach_payments',
  {requested: true},
)
```

There can be a delay before the requested capability becomes active. If the capability has any activation requirements, the response includes them in the `requirements` arrays.

## Collect fees

When a payment is processed, your platform can take a portion of the transaction in the form of application fees. You can set application fee pricing in two ways:

- Use the [Platform Pricing Tool](https://docs.stripe.com/connect/platform-pricing-tools.md) to set and test pricing rules. This no-code feature in the Stripe Dashboard is currently only available for platforms responsible for paying Stripe fees.
- Set your pricing rules in-house, specifying application fees directly in a [PaymentIntent](https://docs.stripe.com/api/payment_intents/object.md). Fees set with this method override the pricing logic specified in the Platform Pricing Tool.

Your platform can take an application fee with the following limitations:

- The value of `application_fee_amount` must be positive and less than the amount of the charge. The application fee collected is capped at the amount of the charge.
- There are no additional Stripe fees on the application fee itself.
- In line with Brazilian regulatory and compliance requirements, platforms based outside of Brazil, with Brazilian connected accounts can’t collect application fees through Stripe.
- The currency of `application_fee_amount` depends upon a few [multiple currency](https://docs.stripe.com/connect/currencies.md) factors.

The resulting charge’s [balance transaction](https://docs.stripe.com/api.md#balance_transaction_retrieve) includes a detailed fee breakdown of both the Stripe and application fees. To provide a better reporting experience, an [Application Fee](https://docs.stripe.com/api/application_fees/object.md) is created after the fee is collected. Use the `amount` property on the application fee object for reporting. You can then access these objects with the [Application Fees](https://docs.stripe.com/api/application_fees/list.md) endpoint.

Earned application fees are added to your available account balance on the same schedule as funds from regular Stripe charges. Application fees are viewable in the [Collected fees](https://dashboard.stripe.com/connect/application_fees) section of the Dashboard.

Application fees for direct charges are created asynchronously by default. If you expand the `application_fee` object in a charge creation request, the application fee is created synchronously as part of that request. Only expand the `application_fee` object if you must, because it increases the latency of the request.

To access the application fee objects for application fees that are created asynchronously, listen for the [application_fee.created](https://docs.stripe.com/api/events/types.md#event_types-application_fee.created) webhook event.

### Flow of funds with fees

When you specify an application fee on a charge, the fee amount is transferred to your platform’s Stripe account. When processing a charge directly on the connected account, the charge amount—less the application fee—is deposited into the connected account.

For example, if you make a charge of 10 USD with a 1.23 USD application fee (like in the previous example), 1.23 USD is transferred to your platform account.

If you process payments in multiple currencies, read [how currencies are handled](https://docs.stripe.com/connect/currencies.md) in Connect.

## Set up Stripe

### Server-side

This integration requires endpoints on your server that talk to the Stripe API. Use the official libraries for access to the Stripe API from your server:

```bash
\# Available as a gem
sudo gem install stripe
```

```ruby
\# If you use bundler, you can add this line to your Gemfile
gem 'stripe'
```

```bash
\# Install through pip
pip3 install --upgrade stripe
```

```bash
\# Or find the Stripe package on http://pypi.python.org/pypi/stripe/
```

```python
\# Find the version you want to pin:
# https://github.com/stripe/stripe-python/blob/master/CHANGELOG.md
# Specify that version in your requirements.txt file
stripe>=5.0.0
```

```bash
\# Install the PHP library with Composer
composer require stripe/stripe-php
```

```bash
\# Or download the source directly: https://github.com/stripe/stripe-php/releases
```

```java
/*
  For Gradle, add the following dependency to your build.gradle and replace with
  the version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
*/
implementation "com.stripe:stripe-java:29.0.0"
```

```xml
<!--
  For Maven, add the following dependency to your POM and replace with the
  version number you want to use from:
  - https://mvnrepository.com/artifact/com.stripe/stripe-java or
  - https://github.com/stripe/stripe-java/releases/latest
-->
<dependency>
  <groupId>com.stripe</groupId>
  <artifactId>stripe-java</artifactId>
  <version>29.0.0</version>
</dependency>
```

```bash
\# For other environments, manually install the following JARs:
# - The Stripe JAR from https://github.com/stripe/stripe-java/releases/latest
# - Google Gson from https://github.com/google/gson
```

```bash
\# Install with npm
npm install stripe --save
```

```bash
\# Make sure your project is using Go Modules
go mod init
# Install stripe-go
go get -u github.com/stripe/stripe-go/v82
```

```go
// Then import the package
import (
  "github.com/stripe/stripe-go/v82"
)
```

```bash
\# Install with dotnet
dotnet add package Stripe.net
dotnet restore
```

```bash
\# Or install with NuGet
Install-Package Stripe.net
```

### Client-side

The [React Native SDK](https://github.com/stripe/stripe-react-native) is open source and fully documented. Internally, it uses the [native iOS](https://github.com/stripe/stripe-ios) and [Android](https://github.com/stripe/stripe-android) SDKs. To install Stripe’s React Native SDK, run one of the following commands in your project’s directory (depending on which package manager you use):

```bash
yarn add @stripe/stripe-react-native
```

```bash
npm install @stripe/stripe-react-native
```

Next, install some other necessary dependencies:

- For iOS, navigate to the **ios** directory and run `pod install` to ensure that you also install the required native dependencies.
- For Android, there are no more dependencies to install.

### Stripe initialization

To initialize Stripe in your React Native app, either wrap your payment screen with the `StripeProvider` component, or use the `initStripe` initialization method. Only the API [publishable key](https://docs.stripe.com/keys.md#obtain-api-keys) in `publishableKey` is required. The following example shows how to initialize Stripe using the `StripeProvider` component.

```javascript
import { StripeProvider } from "@stripe/stripe-react-native";

function App() {
  return (
    <StripeProvider
      publishableKey="<<publishable key>>"
      stripeAccountId="<<connectedAccount>>"
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
    >
      // Your app code here
    </StripeProvider>
  );
}
```

Use your [test API keys](https://docs.stripe.com/keys.md#obtain-api-keys) while you test and develop, and your [live mode](https://docs.stripe.com/keys.md#test-live-modes) keys when you publish your app.

## Add an endpoint

## Integrate the payment sheet

Before displaying the mobile Payment Element, your checkout page should:

- Show the products being purchased and the total amount
- Collect any required shipping information
- Include a checkout button to present Stripe’s UI

In the checkout of your app, make a network request to the backend endpoint you created in the previous step and call `initPaymentSheet` from the `useStripe` hook.

```javascript
export default function CheckoutScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${API_URL}/payment-sheet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: "Jane Doe",
      },
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    // see below
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <Screen>
      <Button variant="primary" disabled={!loading} title="Checkout" onPress={openPaymentSheet} />
    </Screen>
  );
}
```

When your customer taps the **Checkout** button, call `presentPaymentSheet()` to open the sheet. After the customer completes the payment, the sheet is dismissed and the promise resolves with an optional `StripeError<PaymentSheetError>`.

```javascript
export default function CheckoutScreen() {
  // continued from above

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
    }
  };

  return (
    <Screen>
      <Button variant="primary" disabled={!loading} title="Checkout" onPress={openPaymentSheet} />
    </Screen>
  );
}
```

Setting `allowsDelayedPaymentMethods` to true allows [delayed notification](https://docs.stripe.com/payments/payment-methods.md#payment-notification) payment methods like US bank accounts. For these payment methods, the final payment status isn’t known when the `PaymentSheet` completes, and instead succeeds or fails later. If you support these types of payment methods, inform the customer their order is confirmed and only fulfill their order (for example, ship their product) when the payment is successful.

## Set up a return URL (iOS only)

The customer might navigate away from your app to authenticate (for example, in Safari or their banking app). To allow them to automatically return to your app after authenticating, [configure a custom URL scheme](https://developer.apple.com/documentation/xcode/defining-a-custom-url-scheme-for-your-app) and set up your app delegate to forward the URL to the SDK. Stripe doesn’t support [universal links](https://developer.apple.com/documentation/xcode/allowing-apps-and-websites-to-link-to-your-content).

```swift
// This method handles opening custom URL schemes (for example, "your-app://stripe-redirect")
func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    guard let url = URLContexts.first?.url else {
        return
    }
    let stripeHandled = StripeAPI.handleURLCallback(with: url)
    if (!stripeHandled) {
        // This was not a Stripe url – handle the URL normally as you would
    }
}

```

```swift
// This method handles opening custom URL schemes (for example, "your-app://stripe-redirect")
func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey: Any] = [:]) -> Bool {
    let stripeHandled = StripeAPI.handleURLCallback(with: url)
    if (stripeHandled) {
        return true
    } else {
        // This was not a Stripe url – handle the URL normally as you would
    }
    return false
}
```

```swift
@main
struct MyApp: App {
  var body: some Scene {
    WindowGroup {
      Text("Hello, world!")
        .onOpenURL { incomingURL in
          let stripeHandled = StripeAPI.handleURLCallback(with: incomingURL)
          if (!stripeHandled) {
            // This was not a Stripe url – handle the URL normally as you would
          }
        }
    }
  }
}
```

## Handle post-payment events

Stripe sends a [payment_intent.succeeded](https://docs.stripe.com/api/events/types.md#event_types-payment_intent.succeeded) event when the payment completes. Use the [Dashboard webhook tool](https://dashboard.stripe.com/webhooks) or follow the [webhook guide](https://docs.stripe.com/webhooks/quickstart.md) to receive these events and run actions, such as sending an order confirmation email to your customer, logging the sale in a database, or starting a shipping workflow.

Listen for these events rather than waiting on a callback from the client. On the client, the customer could close the browser window or quit the app before the callback executes, and malicious clients could manipulate the response. Setting up your integration to listen for asynchronous events is what enables you to accept [different types of payment methods](https://stripe.com/payments/payment-methods-guide) with a single integration.

In addition to handling the `payment_intent.succeeded` event, we recommend handling these other events when collecting payments with the Payment Element:

| Event                                                                                                                           | Description                                                                                                                                                                                                                                                                         | Action                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [payment_intent.succeeded](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.succeeded)           | Sent when a customer successfully completes a payment.                                                                                                                                                                                                                              | Send the customer an order confirmation and _fulfill_ their order.                                                                                                              |
| [payment_intent.processing](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.processing)         | Sent when a customer successfully initiates a payment, but the payment has yet to complete. This event is most commonly sent when the customer initiates a bank debit. It’s followed by either a `payment_intent.succeeded` or `payment_intent.payment_failed` event in the future. | Send the customer an order confirmation that indicates their payment is pending. For digital goods, you might want to fulfill the order before waiting for payment to complete. |
| [payment_intent.payment_failed](https://docs.stripe.com/api/events/types.md?lang=php#event_types-payment_intent.payment_failed) | Sent when a customer attempts a payment, but the payment fails.                                                                                                                                                                                                                     | If a payment transitions from `processing` to `payment_failed`, offer the customer another attempt to pay.                                                                      |

## Test the integration

| Card number         | Scenario                                                            | How to test                                                                                           |
| ------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 4242424242424242    | The card payment succeeds and doesn’t require authentication.       | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |
| 4000002500003155    | The card payment requires _authentication_.                         | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |
| 4000000000009995    | The card is declined with a decline code like `insufficient_funds`. | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |
| 6205500000000000004 | The UnionPay card has a variable length of 13-19 digits.            | Fill out the credit card form using the credit card number with any expiration, CVC, and postal code. |

| Payment method | Scenario                                                                                                                                                                   | How to test                                                                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
|                | Your customer fails to authenticate on the redirect page for a redirect-based and immediate notification payment method.                                                   | Choose any redirect-based payment method, fill out the required details, and confirm the payment. Then click **Fail test payment** on the redirect page. |
| Pay by Bank    | Your customer successfully pays with a redirect-based and [delayed notification](https://docs.stripe.com/payments/payment-methods.md#payment-notification) payment method. | Choose the payment method, fill out the required details, and confirm the payment. Then click **Complete test payment** on the redirect page.            |
| Pay by Bank    | Your customer fails to authenticate on the redirect page for a redirect-based and delayed notification payment method.                                                     | Choose the payment method, fill out the required details, and confirm the payment. Then click **Fail test payment** on the redirect page.                |

| Payment method    | Scenario                                                                                          | How to test                                                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SEPA Direct Debit | Your customer successfully pays with SEPA Direct Debit.                                           | Fill out the form using the account number `AT321904300235473204`. The confirmed PaymentIntent initially transitions to processing, then transitions to the succeeded status three minutes later. |
| SEPA Direct Debit | Your customer’s payment intent status transitions from `processing` to `requires_payment_method`. | Fill out the form using the account number `AT861904300235473202`.                                                                                                                                |

See [Testing](https://docs.stripe.com/testing.md) for additional information to test your integration.

## Enable Apple Pay

### Register for an Apple Merchant ID

Obtain an Apple Merchant ID by [registering for a new identifier](https://developer.apple.com/account/resources/identifiers/add/merchant) on the Apple Developer website.

Fill out the form with a description and identifier. Your description is for your own records and you can modify it in the future. Stripe recommends using the name of your app as the identifier (for example, `merchant.com.{{YOUR_APP_NAME}}`).

### Create a new Apple Pay certificate

Create a certificate for your app to encrypt payment data.

Go to the [iOS Certificate Settings](https://dashboard.stripe.com/settings/ios_certificates) in the Dashboard, click **Add new application**, and follow the guide.

Download a Certificate Signing Request (CSR) file to get a secure certificate from Apple that allows you to use Apple Pay.

One CSR file must be used to issue exactly one certificate. If you switch your Apple Merchant ID, you must go to the [iOS Certificate Settings](https://dashboard.stripe.com/settings/ios_certificates) in the Dashboard to obtain a new CSR and certificate.

### Integrate with Xcode

Add the Apple Pay capability to your app. In Xcode, open your project settings, click the **Signing & Capabilities** tab, and add the **Apple Pay** capability. You might be prompted to log in to your developer account at this point. Select the merchant ID you created earlier, and your app is ready to accept Apple Pay.

![](images/mobile/ios/xcode.png)
Enable the Apple Pay capability in Xcode

### Add Apple Pay

In accordance with [Apple’s guidelines](https://developer.apple.com/design/human-interface-guidelines/apple-pay#Supporting-subscriptions) for recurring payments, you must also set a `cardItems` that includes a [RecurringCartSummaryItem](https://stripe.dev/stripe-react-native/api-reference/modules/ApplePay.html#RecurringCartSummaryItem) with the amount you intend to charge (for example, “$59.95 a month”).

You can also adopt [merchant tokens](https://developer.apple.com/apple-pay/merchant-tokens/) by setting the `request` with its `type` set to `PaymentRequestType.Recurring`

To learn more about how to use recurring payments with Apple Pay, see [Apple’s PassKit documentation](https://developer.apple.com/documentation/passkit/pkpaymentrequest).

### Order tracking

To add [order tracking](https://developer.apple.com/design/human-interface-guidelines/technologies/wallet/designing-order-tracking) information in iOS 16 or later, configure a `setOrderTracking` callback function. Stripe calls your implementation after the payment is complete, but before iOS dismisses the Apple Pay sheet.

In your implementation of `setOrderTracking` callback function, fetch the order details from your server for the completed order, and pass the details to the provided `completion` function.

To learn more about order tracking, see [Apple’s Wallet Orders documentation](https://developer.apple.com/documentation/walletorders).

## Enable Google Pay

### Set up your integration

To use Google Pay, first enable the Google Pay API by adding the following to the `<application>` tag of your **AndroidManifest.xml**:

```xml
<application>
  ...
  <meta-data
    android:name="com.google.android.gms.wallet.api.enabled"
    android:value="true" />
</application>
```

For more details, see Google Pay’s [Set up Google Pay API](https://developers.google.com/pay/api/android/guides/setup) for Android.

### Add Google Pay

## Enable card scanning (iOS only)

To enable card scanning support, set the `NSCameraUsageDescription` (**Privacy - Camera Usage Description**) in the Info.plist of your application, and provide a reason for accessing the camera (for example, “To scan cards”). Devices with iOS 13 or higher support card scanning.

## Customize the sheet

### Appearance

Customize colors, fonts, and so on to match the look and feel of your app by using the [appearance API](https://docs.stripe.com/elements/appearance-api.md?platform=react-native).

### Merchant display name

Specify a customer-facing business name by setting `merchantDisplayName`. By default, this is your app’s name.

### Dark mode

On Android, set light or dark mode on your app:

```
// force dark
AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
// force light
AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
```

## Complete payment in your UI

You can present Payment Sheet to only collect payment method details and then later call a `confirm` method to complete payment in your app’s UI. This is useful if you have a custom buy button or require additional steps after payment details are collected.

![](images/mobile/payment-sheet/react-native-multi-step.png)

A sample integration is [available on our GitHub](https://github.com/stripe/stripe-react-native/blob/master/example/src/screens/PaymentsUICustomScreen.tsx).

1. First, call `initPaymentSheet` and pass `customFlow: true`. `initPaymentSheet` resolves with an initial payment option containing an image and label representing the customer’s payment method. Update your UI with these details.

```javascript
const { initPaymentSheet, presentPaymentSheet, confirmPaymentSheetPayment } = useStripe();

const { error, paymentOption } = await initPaymentSheet({
  customerId: customer,
  customerEphemeralKeySecret: ephemeralKey,
  paymentIntentClientSecret: paymentIntent,
  customFlow: true,
  merchantDisplayName: "Example Inc.",
});
// Update your UI with paymentOption
```

2. Use `presentPaymentSheet` to collect payment details. When the customer finishes, the sheet dismisses itself and resolves the promise. Update your UI with the selected payment method details.

```javascript
const { error, paymentOption } = await presentPaymentSheet();
```

3. Use `confirmPaymentSheetPayment` to confirm the payment. This resolves with the result of the payment.

```javascript
const { error } = await confirmPaymentSheetPayment();

if (error) {
  Alert.alert(`Error code: ${error.code}`, error.message);
} else {
  Alert.alert("Success", "Your order is confirmed!");
}
```

Setting `allowsDelayedPaymentMethods` to true allows [delayed notification](https://docs.stripe.com/payments/payment-methods.md#payment-notification) payment methods like US bank accounts. For these payment methods, the final payment status isn’t known when the `PaymentSheet` completes, and instead succeeds or fails later. If you support these types of payment methods, inform the customer their order is confirmed and only fulfill their order (for example, ship their product) when the payment is successful.

## Enable additional payment methods

Navigate to [Manage payment methods for your connected accounts](https://dashboard.stripe.com/settings/payment_methods/connected_accounts) in the Dashboard to configure which payment methods your connected accounts accept. Changes to default settings apply to all new and existing connected accounts.

Consult the following resources for payment method information:

- [A guide to payment methods](https://stripe.com/payments/payment-methods-guide#choosing-the-right-payment-methods-for-your-business) to help you choose the correct payment methods for your platform.
- [Account capabilities](https://docs.stripe.com/connect/account-capabilities.md) to make sure your chosen payment methods work for your connected accounts.
- [Payment method and product support](https://docs.stripe.com/payments/payment-methods/payment-method-support.md#product-support) tables to make sure your chosen payment methods work for your Stripe products and payments flows.

For each payment method, you can select one of the following dropdown options:

| |
| |
| **On by default** | Your connected accounts accept this payment method during checkout. Some payment methods can only be off or blocked. This is because your connected accounts with _access to the Stripe Dashboard_ must activate them in their settings page. |
| **Off by default** | Your connected accounts don’t accept this payment method during checkout. If you allow your connected accounts with _access to the Stripe Dashboard_ to manage their own payment methods, they have the ability to turn it on. |
| **Blocked** | Your connected accounts don’t accept this payment method during checkout. If you allow your connected accounts with _access to the Stripe Dashboard_ to manage their own payment methods, they don’t have the option to turn it on. |

![Dropdown options for payment methods, each showing an available option (blocked, on by default, off by default)](images/connect/payment-methods/dropdowns.png)
Payment method options

If you make a change to a payment method, you must click **Review changes** in the bottom bar of your screen and **Save and apply** to update your connected accounts.

![Dialog that shows after clicking Save button with a list of what the user changed](images/connect/payment-methods/dialog.png)
Save dialog

### Allow connected accounts to manage payment methods

Stripe recommends allowing your connected accounts to customize their own payment methods. This option allows each connected account with _access to the Stripe Dashboard_ to view and update their [Payment methods](https://dashboard.stripe.com/settings/payment_methods) page. Only owners of the connected accounts can customize their payment methods. The Stripe Dashboard displays the set of payment method defaults you applied to all new and existing connected accounts. Your connected accounts can override these defaults, excluding payment methods you have blocked.

Check the **Account customization** checkbox to enable this option. You must click **Review changes** in the bottom bar of your screen and then select **Save and apply** to update this setting.

![Screenshot of the checkbox to select when allowing connected owners to customize payment methods](images/connect/payment-methods/checkbox.png)
Account customization checkbox

### Payment method capabilities

To allow your connected accounts to accept additional payment methods, you must make sure their connected accounts have active [capabilities for each payment method](https://docs.stripe.com/connect/account-capabilities.md#payment-methods). Most payment methods have the same verification requirements as the `card_payments` capability, with some restrictions and exceptions. The payment method capabilities table lists the payment methods that require additional verification over cards.

Navigate to the [Connected account payment settings](https://dashboard.stripe.com/settings/payment_methods/connected_accounts) in the Dashboard to request capabilities on your new and existing connected accounts for each payment method and country combination.

For an existing connected account, you can [list](https://docs.stripe.com/api/capabilities/list.md) their existing capabilities to determine whether you need to request additional capabilities.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var service = new AccountCapabilityService();
StripeList<Capability> capabilities = service.List("<<connectedAccount>>");
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CapabilityListParams{Account: stripe.String("<<connectedAccount>>")};
result := capability.List(params);
```

```java
Stripe.apiKey = "<<secret key>>";

Account resource = Account.retrieve("<<connectedAccount>>");

AccountCapabilitiesParams params = AccountCapabilitiesParams.builder().build();

CapabilityCollection capabilities = resource.capabilities(params);
```

```node
const stripe = require("stripe")("<<secret key>>");

const capabilities = await stripe.accounts.listCapabilities("<<connectedAccount>>");
```

```python
import stripe
stripe.api_key = "<<secret key>>"

capabilities = stripe.Account.list_capabilities("<<connectedAccount>>")
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$capabilities = $stripe->accounts->allCapabilities('<<connectedAccount>>', []);
```

```ruby
Stripe.api_key = '<<secret key>>'

capabilities = Stripe::Account.list_capabilities('<<connectedAccount>>')
```

Request additional capabilities by [updating](https://docs.stripe.com/api/capabilities/update.md) each connected account’s capabilities.

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new AccountCapabilityUpdateOptions { Requested = true };
var service = new AccountCapabilityService();
Capability capability = service.Update(
    "<<connectedAccount>>",
    "us_bank_account_ach_payments",
    options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.CapabilityParams{
  Requested: stripe.Bool(true),
  Account: stripe.String("<<connectedAccount>>"),
};
result, err := capability.Update("us_bank_account_ach_payments", params);
```

```java
Stripe.apiKey = "<<secret key>>";

Account account = Account.retrieve("<<connectedAccount>>");

Capability resource = account.capabilities().retrieve("us_bank_account_ach_payments");

CapabilityUpdateParams params = CapabilityUpdateParams.builder().setRequested(true).build();

Capability capability = resource.update(params);
```

```node
const stripe = require("stripe")("<<secret key>>");

const capability = await stripe.accounts.updateCapability(
  "<<connectedAccount>>",
  "us_bank_account_ach_payments",
  {
    requested: true,
  }
);
```

```python
import stripe
stripe.api_key = "<<secret key>>"

capability = stripe.Account.modify_capability(
  "<<connectedAccount>>",
  "us_bank_account_ach_payments",
  requested=True,
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$capability = $stripe->accounts->updateCapability(
  '<<connectedAccount>>',
  'us_bank_account_ach_payments',
  ['requested' => true]
);
```

```ruby
Stripe.api_key = '<<secret key>>'

capability = Stripe::Account.update_capability(
  '<<connectedAccount>>',
  'us_bank_account_ach_payments',
  {requested: true},
)
```

There can be a delay before the requested capability becomes active. If the capability has any activation requirements, the response includes them in the `requirements` arrays.

## Collect fees

When a payment is processed, your platform can take a portion of the transaction in the form of application fees. You can set application fee pricing in two ways:

- Use the [Platform Pricing Tool](https://docs.stripe.com/connect/platform-pricing-tools.md) to set and test pricing rules. This no-code feature in the Stripe Dashboard is currently only available for platforms responsible for paying Stripe fees.
- Set your pricing rules in-house, specifying application fees directly in a [PaymentIntent](https://docs.stripe.com/api/payment_intents/object.md). Fees set with this method override the pricing logic specified in the Platform Pricing Tool.

Your platform can take an application fee with the following limitations:

- The value of `application_fee_amount` must be positive and less than the amount of the charge. The application fee collected is capped at the amount of the charge.
- There are no additional Stripe fees on the application fee itself.
- In line with Brazilian regulatory and compliance requirements, platforms based outside of Brazil, with Brazilian connected accounts can’t collect application fees through Stripe.
- The currency of `application_fee_amount` depends upon a few [multiple currency](https://docs.stripe.com/connect/currencies.md) factors.

The resulting charge’s [balance transaction](https://docs.stripe.com/api.md#balance_transaction_retrieve) includes a detailed fee breakdown of both the Stripe and application fees. To provide a better reporting experience, an [Application Fee](https://docs.stripe.com/api/application_fees/object.md) is created after the fee is collected. Use the `amount` property on the application fee object for reporting. You can then access these objects with the [Application Fees](https://docs.stripe.com/api/application_fees/list.md) endpoint.

Earned application fees are added to your available account balance on the same schedule as funds from regular Stripe charges. Application fees are viewable in the [Collected fees](https://dashboard.stripe.com/connect/application_fees) section of the Dashboard.

Application fees for direct charges are created asynchronously by default. If you expand the `application_fee` object in a charge creation request, the application fee is created synchronously as part of that request. Only expand the `application_fee` object if you must, because it increases the latency of the request.

To access the application fee objects for application fees that are created asynchronously, listen for the [application_fee.created](https://docs.stripe.com/api/events/types.md#event_types-application_fee.created) webhook event.

### Flow of funds with fees

When you specify an application fee on a charge, the fee amount is transferred to your platform’s Stripe account. When processing a charge directly on the connected account, the charge amount—less the application fee—is deposited into the connected account.

For example, if you make a charge of 10 USD with a 1.23 USD application fee (like in the previous example), 1.23 USD is transferred to your platform account.

If you process payments in multiple currencies, read [how currencies are handled](https://docs.stripe.com/connect/currencies.md) in Connect.

## Issue refunds

Just as platforms can create charges on connected accounts, they can also create refunds of charges on connected accounts. [Create a refund](https://docs.stripe.com/api.md#create_refund) using your platform’s secret key while [authenticated](https://docs.stripe.com/connect/authentication.md#stripe-account-header) as the connected account.

Application fees are not automatically refunded when issuing a refund. Your platform must explicitly refund the application fee or the connected account—the account on which the charge was created—loses that amount. You can refund an application fee by passing a `refund_application_fee` value of **true** in the refund request:

```dotnet
StripeConfiguration.ApiKey = "<<secret key>>";

var options = new RefundCreateOptions { Charge = "<<charge>>", RefundApplicationFee = true };
var service = new RefundService();
Refund refund = service.Create(options);
```

```go
stripe.Key = "<<secret key>>"

params := &stripe.RefundParams{
  Charge: stripe.String("<<charge>>"),
  RefundApplicationFee: stripe.Bool(true),
};
result, err := refund.New(params);
```

```java
Stripe.apiKey = "<<secret key>>";

RefundCreateParams params =
  RefundCreateParams.builder().setCharge("<<charge>>").setRefundApplicationFee(true).build();

Refund refund = Refund.create(params);
```

```node
const stripe = require("stripe")("<<secret key>>");

const refund = await stripe.refunds.create({
  charge: "<<charge>>",
  refund_application_fee: true,
});
```

```python
import stripe
stripe.api_key = "<<secret key>>"

refund = stripe.Refund.create(
  charge="<<charge>>",
  refund_application_fee=True,
)
```

```php
$stripe = new \Stripe\StripeClient('<<secret key>>');

$refund = $stripe->refunds->create([
  'charge' => '<<charge>>',
  'refund_application_fee' => true,
]);
```

```ruby
Stripe.api_key = '<<secret key>>'

refund = Stripe::Refund.create({
  charge: '<<charge>>',
  refund_application_fee: true,
})
```

By default, the entire charge is refunded, but you can create a partial refund by setting an `amount` value as a positive integer. If the refund results in the entire charge being refunded, the entire application fee is refunded. Otherwise, a proportional amount of the application fee is refunded. Alternatively, you can provide a `refund_application_fee` value of **false** and [refund the application fee](https://docs.stripe.com/api.md#create_fee_refund) separately.

## See Also

- [Working with multiple currencies](https://docs.stripe.com/connect/currencies.md)
- [Statement descriptors with Connect](https://docs.stripe.com/connect/statement-descriptors.md)
