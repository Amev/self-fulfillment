# Skeleton builder project

## Prerequisites

### Python

You need Python 3.12 installed locally. We strongly advise to use a virtual environment.
To install the available scripts:

```
make dev_install
```

### Terraform & AWS

You need to install [terraform](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) with a version >= 1.4.6, and the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

If it is you first time installing AWS, configure your AWS credentials:

```
aws configure set aws_access_key_id <YOUR_AWS_ACCESS_KEY_ID>
aws configure set aws_secret_access_key <YOUR_AWS_SECRET_ACCESS_KEY>
aws configure set region eu-west-3
```

### Docker

You will need [docker](https://docs.docker.com/engine/install/) and docker compose to run the application locally

## New Project's creation flow

Let's create a new project named "skeleton"

### Creating the repository and AWS Services

0. Authentication external providers

If you're planning on using external providers for authentication (Google, Facebook...), don't forget to create a developer account for each one of them and get your client ID and Secret to pass to AWS Cognito.

1. Create the project

Clone this repository and replace all occurences of "skeleton" with your new project's name (In this tutorial, we create a project named `fortune`)

On Linux:

```
git grep -l 'skeleton' | xargs sed -i 's/skeleton/fortune/g'
```

On Mac:

```
git grep -l 'skeleton' | xargs sed -i '' -e 's/skeleton/fortune/g'
```

Don't forget to update not committed files as well if necessary (for example `.env` at the project root)

2. Deploy all required services on AWS

This project's infrastructure is 100% handled by Terraform config, do not create or update any AWS Service manually.

Before deploying the full infrastructure with Terraform, add your personal IPv4 and IPv6 addresses to the backend load balancer config, inside the file `deploy/backend-lb.tf`.

Let's deploy the full infrastructure:

```
cd fortune/deploy
terraform init
terraform plan
terraform apply
```

**This might take 10 to 15 minutes** the first time, but everything will be quicker to update later.

### Running the project locally

1. Update your local `.env` file

Most values are already set, but you may need to fill the missing ones (they are commented) based on this command (to run inside your `deploy` folder):

```
$ terraform output -json
{
  "AWS_ACCESS_KEY_ID": {
    "sensitive": false,
    "type": "string",
    "value": "<YOUR_ACCESS_KEY_ID>"
  },
  ...
}
```

2. Launch the application with Docker

At the repository's root, simply run:

```
docker compose up -d
```

3. Update your database Social applications

We use the [django allauth](https://django-allauth.readthedocs.io/en/latest/) library for the authentication with AWS Cognito, so you'll need to create a "Social Application" object in your DB with your AWS Cognito credentials. To do so:

- Go to http://localhost:8000/admin, login with the credentials in your .env (ADMIN_EMAIL and ADMIN_PWD), and go to http://localhost:8000/admin/sites/site/. Update the domain name to "localhost:8000"
- Go to http://localhost:8000/admin/socialaccount/socialapp/add/ to create a new Social Application, with the following variables:
  - Provider: "Amazon Cognito"
  - Name: "Cognito"
  - Client ID: Put the "cognito_client_id" from terraform output
  - Secret Key: Put the "cognito_client_secret" from terraform output
  - Sites: add "localhost:8000" which we just created

4. Update external identity providers

For each external identify provider, add `{cognito_login_url}/oauth2/idpresponse` as a valid redirect URI

### Running the project in production

0. Setup secrets in AWS

All sensitive secrets are stored in a Secrets Manager Vault in your AWS Account.
Your application services (like the backend ECS task for example) can access your vault to retrieve secrets values when needed thanks to specific IAM Policies.

**All secrets values are manually edited by you** from the AWS Console (this is the only manually edited service) - For security reasons.

Don't forget to relaunch a backend task when you update a secret value.

1. Make CI/CD Functional

The skeleton creates a github action to automatically deploy the backend and frontend when someone pushes on the `main` branch.
In order to make it functional, 3 github secrets are required. Head to `https://github.com/Vezero-io/<YOUR_PROJECT>/settings/secrets/actions` and add the following variables:

| Name                  | Value                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| AWS_ACCESS_KEY_ID     | "<YOUR_KEY_ID>"                                                                                                                                        |
| AWS_SECRET_ACCESS_KEY | "<YOUR_SECRET>"                                                                                                                                        |
| BACKEND_REGISTRY      | "<BACKEND_REGISTRY_URL>" (Take the terraform "ecr_url") without the last part, it should look like this `936762620878.dkr.ecr.eu-west-3.amazonaws.com` |

2. Update Production environment variables
   Fill the required values in `frontend/.env.production` (the file is already created with the necessary variables).

3. Create DNS records

To use custom domain names, you need to update your DNS records:

- Backend URL

  - Type : CNAME
  - Name : `fortune-backend`
  - Value : `<prod_lb_domain>` (from terraform output)

- Auth URL

  - Type : CNAME
  - Name : `fortune-auth`
  - Value : `<cloudfront_auth_url>` (from terraform output)

- Application URL

  - Type : CNAME
  - Name : `fortune-app`
  - Value : `<cloudfront_app_url>` (from terraform output)

- Admin URL

  - Type : CNAME
  - Name : `fortune-admin`
  - Value : `<cloudfront_admin_url>` (from terraform output)

- Design URL

  - Type : CNAME
  - Name : `fortune-design`
  - Value : `<cloudfront_design_url>` (from terraform output)

- Showcase URL
  - Type : CNAME
  - Name : `fortune-showcase`
  - Value : `<cloudfront_showcase_url>` (from terraform output)

4. Update your **production** database Social applications

Follow the same steps as previously in "Running the project locally - Update your database Social applications" in your **production** admin interface. The url should be something like `fortune-backend.vezero.fr/admin`.

One difference: The site should be `fortune-backend.vezero.fr`, not `localhost:8000`.
