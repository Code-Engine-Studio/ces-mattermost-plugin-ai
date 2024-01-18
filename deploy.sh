
#!/bin/bash

echo "Deploying to CES Mattermost Server"

default_site_url="https://chat.codeenginestudio.com"

read -p "Mattermost Server [https://chat.codeenginestudio.com]: " site_url
site_url=${site_url:-$default_site_url}

# Read Username
read -p "Username: " username

if [[ -z "$username" ]]; then
    echo "Username is empty"
    exit 0
fi

# Read Password
read -p "Password: " -s password
echo

if [[ -z "$password" ]]; then
    echo "Username is empty"
    exit 0
fi

# Read MFA
read -p "MFA: " mfa

if [[ -z "$mfa" ]]; then
    echo "Username is empty"
    exit 0
fi

echo $username $password $mfa

echo "Deploying to Mattermost Server at" $site_url
MM_SERVICESETTINGS_SITEURL=${site_url} MM_ADMIN_USERNAME=${username} MM_ADMIN_PASSWORD=${password} make deploy


