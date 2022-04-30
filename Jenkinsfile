pipeline {
    // Declare variables that will be used by the later stages
    environment {
			DOCKERHUB_REGISTRY = "jasvinjames/fintrack"
			DOCKERHUB_CREDENTIALS = credentials('dockerhub-id')
			ANSIBLE_VAULT_CREDENTIALS = credentials('fintrack-ansible-vault-password')
    }
    
    agent any 
    
    stages {
        
			stage('Git Pull') {
				steps {
					// credentials are required because its a private repository
					git url: 'https://github.com/james-jasvin/FinTrack.git',
					branch: 'master',
					credentialsId: 'github-pat'
				}
			}
        
			stage ('Running React Tests (Jest)') {
				steps {
					sh '''
							cd frontend
							npm ci
							npm run test
					'''
				}
			}
			
			stage ('Running API Tests (Supertest)') {
				steps {
					sh '''
							cd backend
							echo $ANSIBLE_VAULT_CREDENTIALS > secret.txt
							ansible-vault decrypt env-enc.yaml --vault-password-file secret.txt
							npm ci
							npm run test
							ansible-vault encrypt env-enc.yaml --vault-password-file secret.txt
							if [ -f secret.txt ] ; then
								rm secret.txt
							fi
					'''
				}
			}

			stage('Build Fintrack Backend Docker Image') {
				steps {
			    sh "docker build -t $DOCKERHUB_REGISTRY-backend:latest backend/"
			  }   
			}

			stage('Build Fintrack Frontend Docker Image') {
				steps {
					sh "docker build -t $DOCKERHUB_REGISTRY-frontend:latest frontend/"
				}   
			}

			stage('Login to Docker Hub') {
				steps {
					sh "echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin"
				}
			}

			stage('Push Backend Docker Image to Docker Hub') {
			  steps {
			    sh "docker push $DOCKERHUB_REGISTRY-backend:latest"
			  }
			}

			stage('Push Frontend Docker Image to Docker Hub') {
				steps {
					sh "docker push $DOCKERHUB_REGISTRY-frontend:latest"
				}
			}
        
			stage('Removing Docker Images from Local') {
				steps {
					sh "docker rmi $DOCKERHUB_REGISTRY-frontend:latest"
					sh "docker rmi $DOCKERHUB_REGISTRY-backend:latest"
				}
			}
        
			// Ansible Deploy to remote server (managed host)
			stage('Ansible Deploy') {
				steps {
					ansiblePlaybook becomeUser: 'null',
					colorized: true,
					installation: 'Ansible',
					inventory: 'inventory',
					playbook: 'ansible-playbook.yml',
					sudoUser: 'null',
					vaultCredentialsId: 'fintrack-ansible-vault-password'
				}
			}
    }
}