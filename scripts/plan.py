from github import Github 
from github import Auth
import json
import os
import sys

auth = Auth.Token("")

g = Github(auth=auth)

org_name = "Cyber4All"
org = g.get_organization(org_name)

repo = g.get_repo("Cyber4All/Security-Injections")
print(repo)

pullrequests = repo.get_pulls(state='open', sort='updated', base='main')
latest_pr = ''
commits = []

if pullrequests.totalCount > 0:
    # Get the most recent PR
    latest_pr = pullrequests[0]
    commits = latest_pr.get_commits()
    print(f"Latest PR: {latest_pr.title} (#{latest_pr.number})")
else:
    print("No open pull requests found.")
    sys.exit()

absoluteFilePaths = []
comment = "Modules: "

for c in commits:
    print(c)
    files = c.files
    for f in files:
        # print("File: " + f.filename)
        path = os.path.abspath(f.filename)
        if "content/" in path and path not in absoluteFilePaths:
            absoluteFilePaths.append(path)

if not absoluteFilePaths: # if no commits have changes to modules, exit
    print("No changes to modules")
    sys.exit()

output = open("file2.txt", "w")

# example of what a real path would look like for content changes -
# /Users/username/Documents/clark/security_injections/security-injections/content/Interdisciplinary/Business/CAT/content.json
for path in absoluteFilePaths:
    pathParts = path.split(os.path.sep)
    # would return ['', 'Users', 'username', 'Documents', 'clark', 'security_injections', 'security-injections', 'content', 'Interdisciplinary', 'Business', 'CAT', 'content.json']
    parentFolder = pathParts[-2] # would return "CAT"
    comment = comment + parentFolder + ", "
    grandParentFolder = pathParts[-3] # would return "Business"
    output.write("Parent: " + parentFolder + ", Grandparent: " + grandParentFolder + "\n")
    # output.txt would look like:
    # Parent : CAT, Grandparent: Business

output.close()

# PR Comment ---
comment = comment[:-2] + " have been updated! -PyGithub"
latest_pr.create_issue_comment(comment)

g.close()