from github import Github 
from github import Auth
import json
import os

auth = Auth.Token("")

g = Github(auth=auth)

#user = g.get_user()
#print("User login: ", user.login)

#for repo in g.get_user().get_repos():
 #   print(repo.name)

# Cyber4All organization repos
org_name = "Cyber4All"
org = g.get_organization(org_name)

# print(f"\nRepositories in {org_name}:")
# for repo in org.get_repos():
#     print(repo.name)

repo = g.get_repo("Cyber4All/Security-Injections")
print(repo)


def getFilename(filepath):
    startIndex = len(filepath) - 1
    for i in range(startIndex, -1, -1):
        if filepath[i] == '/':
            return filepath[i:startIndex + 1]  # Create substring from last index to '/'
    return None

# Get the latest commit
latest_commit = repo.get_commits()[0]
print(f"Latest Commit: {latest_commit.sha}, made {latest_commit.commit.committer.date} by {latest_commit.commit.committer.name}")

absoluteFilePaths = []

# Print the changed files in the latest commit
for file in latest_commit.files:
    print(f" - {file.filename} (status: {file.status})")
    absoluteFilePaths.append(os.path.abspath(file.filename))

output = open("scripts/moduleOutput.txt", "w")
# output.write("Content deleted!")
# output.close()    

# example of what a real path would look like for content changes -
# /Users/username/Documents/clark/security_injections/security-injections/content/Interdisciplinary/Business/CAT/content.json
for path in absoluteFilePaths:
    if "content/" not in path:
    # if "resources/" not in file:
        print("No changes to modules")
    else:
        pathParts = path.split(os.path.sep)
        # would return ['', 'Users', 'username', 'Documents', 'clark', 'security_injections', 'security-injections', 'content', 'Interdisciplinary', 'Business', 'CAT', 'content.json']
        parentFolder = pathParts[-2] # would return "CAT"
        grandParentFolder = pathParts[-3] # would return "Business"
        output.write("Parent: " + parentFolder + ", Grandparent: " + grandParentFolder + "\n")

output.close()

g.close()