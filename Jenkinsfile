 pipeline { 
    agent { label 'EXPLORER_FRONTEND_NODE' }

    stages {
        stage('Github Checkout') {
            steps { 
           
                git branch: 'main', credentialsId: 'github-authentication', url: 'https://github.com/PolluxCoin2-0/Crowd1_FRONTEND.git'
            }
        }
        
        stage('Copy .env file') { 
            steps { 
                script {
                    configFileProvider([configFile(fileId: '853e5e46-7516-4592-a14e-484cc533db86', variable: 'ENV_FILE')]) {
                        sh 'cp "$ENV_FILE" /home/jenkins/workspace//crowd1-frontend-cicd-pipeline/.env'
                    }
                 } 
            }
        }
 
        stage('Installing Dependencies') {
            steps {
                sh 'rm -rf node_modules || true'
                 
                sh 'npm install vite'
            }
        }

        stage('Build the Frontend Application') {
            steps {
                sh 'rm -rf dist || true'
                sh 'npm run build'
                sh 'chmod 755 dist/assets/*'
                sh 'chmod 755 dist/index.html'
            }
        } 

        stage('Deploy to Web Server') {
            steps {
                
                
                sh 'cp -r dist/* /var/www/html/crowd1F'
            
            }
        }
    }
}
