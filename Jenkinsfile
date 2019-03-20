/* Jenkinsfile for SearchUI */
pipeline {
    agent { label 'nodejs' }
    environment {
        CHROME_BIN = '/bin/google-chrome'
    }
    stages {
        stage('dependencies') {
            steps {
                echo 'Setting up dependencies ...'
                sh 'npm i'
            }
        }
        stage('build') {
            steps {
                echo 'Building ...'
                sh 'npm build'
            }
        }
        stage('unit test') {
	    steps {
		echo 'Running Unit Tests ...'
                sh 'npm test'
            }
        }
        stage('e2e test') {
            steps {
                echo 'Running end-to-end Tests ...'
                sh 'npm e2e'
            }
        }
	stage('deploy') {
            steps {
                echo 'Deploying ...'
            }
        }
    }
}
