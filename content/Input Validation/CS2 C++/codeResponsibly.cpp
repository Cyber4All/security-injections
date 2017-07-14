#include <iostream>
using namespace std;
void getNames(string[], int);
int getWhich();
string getName(int, string[],int);
const int SIZE = 10;


int main()
{
  int which;
  string names[SIZE];
  getNames(names,SIZE);

  which =getWhich();
  string aName = getName(which,names,SIZE);
  cout << "You choose name: "  << aName;

  return 0;
}


void getNames(string names[],size_t sz)
{
  for (size_t i = 0; i < sz; i++ )
  {
    cout << "type name # " << i+1 <<": ";
    cin >> names[i];
  }
}


size_t getWhich()
{
  size_t x;
  cout << "Which name: ";
  cin >> x;
  return x;
}


string getName(size_t n,string vals,size_t sz)
{
    if (n >=1 && n <= sz)
      return vals[n-1];
    else
      return "";
}