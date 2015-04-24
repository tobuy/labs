## Synopsis && Motivation

CloudWatch does not include memory consumption metrics.

## Installation

Instructions:

```
$ sudo apt-get install default-jre
$ mkdir cloudwatch
$ cd cloudwatch
$ wget http://ec2-downloads.s3.amazonaws.com/CloudWatch-2010-08-01.zip
$ unzip CloudWatch-2010-08-01.zip
$ wget https://raw.githubusercontent.com/tobuy/labs/master/cloudwatch_ram/memreport.sh
```

At this point you should take a look at the script to check that you are sending metrics to the right region (script line number 5).
Once that is completed, continue the installation process:


```
$ chmod +x memreport.sh
$ wget https://raw.githubusercontent.com/tobuy/labs/master/cloudwatch_ram/AWSCredentials.properties
```

Open `AWSCredentials.properties` and replace question marks with your own credentials. 
Keep going:

```
$ chmod 600 AWSCredentials.properties
$ crontab -e
```

How frequently you want to record the metric is up to you but if you want to run the script every 5 minutes you should add this:

```
*/5 * * * * /home/ubuntu/cloudwatch/memreport.sh
```

## Reference

The script doing most of the magic was found [here.](https://forums.aws.amazon.com/message.jspa?messageID=266893)
Thanks to the author of such post.

## Contributors

**Marcos Chicote**
- <https://github.com/mchicote>

## Copyright and license

Code and documentation copyright 2015 Acelerados SRL. Code released under [the MIT license](https://github.com/twbs/bootstrap/blob/master/LICENSE). Docs released under [Creative Commons](https://github.com/twbs/bootstrap/blob/master/docs/LICENSE).
