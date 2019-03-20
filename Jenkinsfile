/* Jenkinsfile for SearchUI */
pipeline {
    agent { label 'nodejs' }
    }
    stages {
        stage('dependencies') {
            steps {
                echo 'Setting up dependencies ...'
                sh 'npm install'
            }
        }
        stage('build') {
            steps {
                echo 'Building ...'
                sh 'ng build'
            }
        }
        stage('unit test') {
	    steps {
		echo 'Running Unit Tests ...'
                sh 'ng test'
            }
        }
        stage('e2e test') {
            steps {
                echo 'Running end-to-end Tests ...'
                sh 'ng e2e'
            }
        }
	stage('deploy') {
            steps {
                echo 'Deploying ...'
	/* cd dist${APPLICATION}	      */
	/* aws s3 sync . "s3://${S3_BUCKET}"  */
       }
   }
}
