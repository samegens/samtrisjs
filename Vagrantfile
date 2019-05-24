Vagrant.configure("2") do |config|
  config.vm.define "docker" do |docker|
    docker.vm.box = "ubuntu/bionic64"
    docker.vm.hostname = "docker"
    docker.vm.network "private_network", ip: "192.168.33.10"
	
	# Install docker
	docker.vm.provision "docker" do |d|
	end
  end
end
