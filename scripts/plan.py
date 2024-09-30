from github import Github 

from github import Auth

auth = Auth.Token("")

g = Github(auth=auth)

# g = Github(auth=auth, base_url="http://{host}/api/v3")

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


# lists contents of a directory, helped find the name of the file paths
def list_directory_contents(path=""):
    contents = repo.get_contents(path)
    for content in contents:
        if content.type == "dir":
            print(f"Directory: {content.path}")
            # Recursively list contents of the directory
            list_directory_contents(content.path)
        else:
            print(f"File: {content.path}")

# list_directory_contents()

# Get the latest commit
latest_commit = repo.get_commits()[0]
print(f"Latest Commit: {latest_commit.sha}, made {latest_commit.commit.committer.date} by {latest_commit.commit.committer.name}")

changedModulePaths = []

# Print the changed files in the latest commit
for file in latest_commit.files:
    print(f" - {file.filename} (status: {file.status})")

for file in latest_commit.files:
    if "content/Secure Coding/" not in file.filename:
        print("No changes to modules")
    else:
        changedModulePaths.append(file.filename)
        print("added")

for path in changedModulePaths:
    print(path)

g.close()