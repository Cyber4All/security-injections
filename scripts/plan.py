from github import Github 
from github import Auth
import os
import sys
import logging

logger = logging.getLogger(__name__)

logging.basicConfig(
    level=logging.INFO,
    format="[%(levelname)s] %(asctime)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

try:
    pull_request_id = int(os.getenv("CIRCLE_PULL_REQUEST").split("/")[-1])
    commit_hash = os.getenv("CIRCLE_SHA1")
    token = os.getenv("GITHUB_TOKEN")
    auth = Auth.Token(token)

    g = Github(auth=auth)

    org_name = "Cyber4All"
    org = g.get_organization(org_name)

    repo = g.get_repo("Cyber4All/Security-Injections")
    pull_request = repo.get_pull(pull_request_id)
    commits = pull_request.get_commits()
    logger.info("Authorization complete, Repository and Pull Request retrieved.")
except:
    logger.error("Error in GitHub authorization.")
    sys.exit()


absoluteFilePaths = []
comment = """
# Modules to be Updated Upon Merging
This pull request affects several modules that will be updated upon merging. 
Below is a table listing the impacted modules and their corresponding locations in the repository. 
The table includes the parent, grandparent, and great-grandparent directories to provide better context about where these modules are located.

| Module Name              | Parent Folder            | Grandparent Folder       | Great-Grandparent Folder |
| ------------------------ | ------------------------ | ------------------------ | ------------------------ |"""

logger.info("Viewing Pull Request " + str(pull_request_id) + " commit history..")

for c in commits:
    files = c.files
    for f in files:
        path = os.path.abspath(f.filename)
        if "content/" in path and path not in absoluteFilePaths:
            logger.info("File: " + path + ", added to list of changed modules.")
            absoluteFilePaths.append(path)

if not absoluteFilePaths: # if no commits have changes to modules, exit
    logger.info("Commits contain no changes to content modules, exiting process.")
    sys.exit()

output = open("scripts/moduleOutput.txt", "w") # creates new text file

# example of what a real path would look like for content changes -
# content/Interdisciplinary/Business/CAT/content.json
for path in absoluteFilePaths:
    pathParts = path.split(os.path.sep)
    # would return ['', 'Users', 'username', 'Documents', 'clark', 'security_injections', 'security-injections', 'content', 'Interdisciplinary', 'Business', 'CAT', 'content.json']
    module = pathParts[-1]
    parentFolder = pathParts[-2] # would return "CAT"
    grandParentFolder = pathParts[-3] # would return "Business"
    greatGrandParent = pathParts[-4] # would return "Interdisciplinary"
    comment = comment + "\n| " + module + " | " + parentFolder + " | " + grandParentFolder + " | " + greatGrandParent + " |"
    output.write(parentFolder + "," + grandParentFolder + "," + greatGrandParent + "\n")
    # output.txt would look like: CAT,Business,Interdisciplinary,

output.close()
logger.info("All modules written to output file.")

# PR Comment ---
comment = comment + "\n\nPlease review the modules listed to ensure all necessary changes are accounted for before merging."
pull_request.create_issue_comment(comment)
logger.info("Comment finalized and created on Pull Request " + str(pull_request_id))

g.close()