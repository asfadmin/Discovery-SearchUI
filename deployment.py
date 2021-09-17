'''
To run
'''

import argparse
import os
import sys
import json

MEMBERS = ['will', 'greg', 'tyler', 'kim', 'andy']

def main():
    parser = argparse.ArgumentParser(description='''
        Set branch for personal vertex deployments, branch defaults to current checkout branch.
        For more info checkout readme.
    ''')
    parser.add_argument('deployment',
                        help=f'Deployment to update. ({MEMBERS})')
    parser.add_argument('--branch', '-b',
                        help='branch to set codepipline to pull from')

    args = parser.parse_args()
    member, branch = args.deployment, args.branch

    if branch is None:
        branch = os.popen('git rev-parse --abbrev-ref HEAD').read().strip()

    if not is_valid_member(member):
        print(f'"{member}" does not have a deployment.')
        return

    deployment = f'SearchUI-{member}'
    pipeline_file = 'pipeline.json'

    os.system(f'aws codepipeline get-pipeline --name {deployment} > {pipeline_file}')

    with open(pipeline_file) as f:
        pipeline = json.loads(f.read())

    print(f'Updating pipeline "{deployment}" to build from "{branch}"')
    pipeline['pipeline']['stages'][0]['actions'][0]['configuration']['BranchName'] = branch
    pipeline = {
        'pipeline': pipeline['pipeline']
    }

    with open(pipeline_file, 'w') as f:
        json.dump(pipeline, f)

    os.system(f'aws codepipeline update-pipeline --cli-input-json file://{pipeline_file} > /dev/null')
    print('Done.')
    print('\nStarting pipeline...')
    os.system(f'aws codepipeline start-pipeline-execution --name {deployment}')
    os.system(f'rm {pipeline_file}')

def is_valid_member(member):
    return member in MEMBERS

if __name__ == "__main__":
    main()
