# Eola Pets Homepage and Lead Generation

This is the homepage and webapp for Eola Pets
created using [sveltekit](https://kit.svelte.dev)

## Developing

Once you've downloaded the repo, type:

```bash
npm install
```

!! WE HAVE TO USE A DATABASE !!

To generate the required Google API credentials, download a JSON OAuth file and place it in /auth
then run:

```bash
gcloud iam service-accounts create SERVICE_ACCOUNT_NAME
gcloud projects add-iam-policy-binding PROJECT_ID --member="serviceAccount:SERVICE_ACCOUNT_NAME@PROJECT_ID.iam.gserviceaccount.com" --role=ROLE



gcloud auth application-default login --client-id-file=auth/credentials.apps.googleusercontent.com.json --scopes=https://www.googleapis.com/auth/gmail.send,https://www.googleapis.com/auth/contacts,https://www.googleapis.com/auth/calendar,https://www.googleapis.com/auth/drive.file,https://www.googleapis.com/auth/tasks
```

Then run

```bash
npm run dev -- --open
```

## Site-map

    - homepage: landing
        - team: team page
            -[teamId]: profile page
        - services: services landing
            -
        - retail
        - signup
        - links
        - events
        - legal
    - app
        neighborhood
        humans
        pets
        schedule
    - admin
        - check API tokens: Google & Square
        - update team member profiles
        - edit services
        -

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Deploying

To deploy to Google AppEngine:

```bash
gcloud app deploy build/app.yaml
```

setups to google cloud app engine deploy

create project eolapets-site-dev
add eolapets.dev@gmail.com as people (owner)
enable apis: gmail, drive, people, blogger, tasks
create concent screen with scopes
create OAuth client ID credential, Desktop, and download JSON

gcloud auth application-default login --client-id-file=auth/credentials.apps.googleusercontent.com.json --scopes=openid,https://www.googleapis.com/auth/gmail.send,https://www.googleapis.com/auth/contacts,https://www.googleapis.com/auth/calendar,https://www.googleapis.com/auth/drive.file,https://www.googleapis.com/auth/tasks,https://www.googleapis.com/auth/blogger,https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/sqlservice.login,https://www.googleapis.com/auth/userinfo.profile,https://www.googleapis.com/auth/userinfo.email
