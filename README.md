# Zerotier DNS Manager

This tool is designed to keep Route53 DNS records updated based on the members of a Zerotier network. It grabs a list of members and grabs a list of scoped Route53 records that have `.zt.` in the record and creates or deleted records based on comparing the two lists. 

## Usage
Clone the repo and create a `.env` file with the following contents:

```
zt_api_key=<your zerotier api key>
aws_access_key_id=<your aws access key id>
aws_secret_access_key=<your aws secret access key>
hosted_zone=<your route53 hosted zone id>
zt_network=<your zerotier network id>
sleep_timeout=<a reasonable sleep timeout in milliseconds>
```

Then execute the code:
`node index.js`

After running it you can use DNS names to get to your Zerotier members. 
```
ssh <membername>.zt.example.com
```

You can leave it running and it will keep the DNS records updated when there are changes. 

The only other requirement is that members of your zerotier network have a *short name*. If they do not have a *short name* the request to Route53 will fail. 

## Contributing

Open a PR and lets talk. :)