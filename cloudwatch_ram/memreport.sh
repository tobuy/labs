#!/bin/bash

export AWS_CLOUDWATCH_HOME=/home/ubuntu/cloudwatch/CloudWatch-1.0.20.0
export AWS_CREDENTIAL_FILE=/home/ubuntu/cloudwatch/AWSCredentials.properties
export AWS_CLOUDWATCH_URL=https://monitoring.us-west-2.amazonaws.com
export PATH=$AWS_CLOUDWATCH_HOME/bin:$PATH
export JAVA_HOME=/usr/lib/jvm/default-java

# get ec2 instance id
instanceid=`wget -q -O - http://169.254.169.254/latest/meta-data/instance-id`

memtotal=`free -m | grep 'Mem' | tr -s ' ' | cut -d ' ' -f 2`
memfree=`free -m | grep 'buffers/cache' | tr -s ' ' | cut -d ' ' -f 4`
let "memused=100-memfree*100/memtotal"

mon-put-data --metric-name "FreeMemoryMBytes" --namespace "System/Linux" --dimensions "InstanceId=$instanceid" --value "$memfree" --unit "Megabytes"

mon-put-data --metric-name "UsedMemoryPercent" --namespace "System/Linux" --dimensions "InstanceId=$instanceid" --value "$memused" --unit "Percent"
