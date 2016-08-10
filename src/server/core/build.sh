#!/usr/bin/env bash


#installing docker
apt-get update
apt-get -y upgrade
apt-get install apt-transport-https ca-certificates
apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
version=$( lsb_release -r | grep -oP "[0-9]+" | head -1 )
echo "$version"
if [ "$version" = "12" ]; then
    echo "deb https://apt.dockerproject.org/repo ubuntu-precise main" >> "/etc/apt/sources.list.d/docker.list"
elif [ "$version" = "14" ]; then
    echo "deb https://apt.dockerproject.org/repo ubuntu-trusty main" >> "/etc/apt/sources.list.d/docker.list"
elif [ "$version" = "15" ]; then
    echo "deb https://apt.dockerproject.org/repo ubuntu-wily main" >> "/etc/apt/sources.list.d/docker.list"
elif [ "$version" = "16" ]; then
    echo "deb https://apt.dockerproject.org/repo ubuntu-xenial main" >> "/etc/apt/sources.list.d/docker.list"
else
    exit "os doesn't supported"
fi
apt-get update
apt-get purge lxc-docker
apt-cache policy docker-engine
if [ "$version" = "12" ]; then
    apt-get update
    apt-get install -y linux-image-generic-lts-trusty
else
    apt-get update
    apt-get install -y linux-image-extra-$(uname -r)
fi
apt-get update
apt-get install -y docker-engine
service docker start

#installing nomad

cd ~/
wget https://releases.hashicorp.com/nomad/0.4.0/nomad_0.4.0_linux_amd64.zip
apt-get install unzip
unzip nomad_0.4.0_linux_amd64.zip
rm nomad_0.4.0_linux_amd64.zip
mv nomad /usr/local/bin


#intalling consul

wget https://releases.hashicorp.com/consul/0.6.4/consul_0.6.4_linux_amd64.zip
unzip consul_0.6.4_linux_amd64.zip
rm consul_0.6.4_linux_amd64.zip
mv consul /usr/local/bin

exit 0