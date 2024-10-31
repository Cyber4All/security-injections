from github import Github
from github import Auth
import os
import logging

logger = logging.getLogger(__name__)

logging.basicConfig(
    level=logging.INFO,
    format="[%(levelname)s] %(asctime)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)


def get_pull_request_id():
    pull_requests = repo.get_pulls(state="closed")
    for pr in pull_requests:
        if pr.head.sha == CIRCLE_SHA1:
            return pr.number


def get_plan():
    """Returns a tuple of the modules that have been changed in the pull request."""

    logger.info(f"Viewing Pull Request {pull_request_id} commit history..")

    absoluteFilePaths = []
    for c in commits:
        for f in c.files:
            path = os.path.abspath(f.filename)
            if "content/" in path and path not in absoluteFilePaths:
                logger.info("File: " + path + ", added to list of changed modules.")
                absoluteFilePaths.append(path)

    logger.info(f"Commits contain {len(absoluteFilePaths)} changes to content modules.")

    changes = []
    for path in absoluteFilePaths:
        logger.info("Changed module: " + path)
        pathParts = path.split(os.path.sep)
        # would return ['', 'Users', 'username', 'Documents', 'clark', 'security_injections', 'security-injections', 'content', 'Interdisciplinary', 'Business', 'CAT', 'content.json']
        module = pathParts[-1]
        parentFolder = pathParts[-2]  # would return "CAT"
        grandParentFolder = pathParts[-3]  # would return "Business"
        greatGrandParent = pathParts[-4]  # would return "Interdisciplinary"

        changes.append((module, parentFolder, grandParentFolder, greatGrandParent))

    # example of what a real path would look like for content changes -
    # content/Interdisciplinary/Business/CAT/content.json
    output = open("scripts/moduleOutput.txt", "w")
    for change in changes:
        # output.txt would look like: CAT,Business,Interdisciplinary,
        output.write(change[1] + "," + change[2] + "," + change[3] + "\n")
    output.close()

    return changes


def make_comment(changes):
    """Returns a comment for the pull request with the modules that have been changed."""
    comment = """
# Modules to be Updated Upon Merging
This pull request affects several modules that will be updated upon merging. 
Below is a table listing the impacted modules and their corresponding locations in the repository. 
The table includes the parent, grandparent, and great-grandparent directories to provide better context about where these modules are located.

| Module Name              | Parent Folder            | Grandparent Folder       | Great-Grandparent Folder |
| ------------------------ | ------------------------ | ------------------------ | ------------------------ |"""

    for change in changes:
        # would return ['', 'Users', 'username', 'Documents', 'clark', 'security_injections', 'security-injections', 'content', 'Interdisciplinary', 'Business', 'CAT', 'content.json']
        module = change[0]
        parentFolder = change[1]  # would return "CAT"
        grandParentFolder = change[2]  # would return "Business"
        greatGrandParent = change[3]  # would return "Interdisciplinary"
        comment = (
            comment
            + "\n| "
            + module
            + " | "
            + parentFolder
            + " | "
            + grandParentFolder
            + " | "
            + greatGrandParent
            + " |"
        )

        logger.info("All modules written to output file.")

        # PR Comment ---
        comment = (
            comment
            + "\n\nPlease review the modules listed to ensure all necessary changes are accounted for before merging."
        )

        return comment


if __name__ == "__main__":
    CIRCLE_PULL_REQUEST = os.getenv("CIRCLE_PULL_REQUEST")
    CIRCLE_SHA1 = os.getenv("CIRCLE_SHA1")
    GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

    ORG_NAME = "Cyber4All"

    try:
        g = Github(auth=Auth.Token(GITHUB_TOKEN))
        repo = g.get_repo(f"{ORG_NAME}/Security-Injections")
        pull_request_id = (
            get_pull_request_id()
            if not CIRCLE_PULL_REQUEST
            else int(CIRCLE_PULL_REQUEST.split("/")[-1])
        )

        pull_request = repo.get_pull(pull_request_id)
        commits = pull_request.get_commits()
        logger.info("Authorization complete, Repository and Pull Request retrieved.")
    except Exception as e:
        logger.error(e)
        logger.error("Error in GitHub authorization: " + str(e))
        exit(1)

    changes = get_plan()

    if CIRCLE_PULL_REQUEST and len(changes) > 0:
        comment = make_comment(changes)
        pull_request.create_issue_comment(comment)
        logger.info(
            "Comment finalized and created on Pull Request " + str(pull_request_id)
        )

    g.close()
