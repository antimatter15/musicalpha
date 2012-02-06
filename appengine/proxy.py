"""


form_fields = {
  "first_name": "Albert",
  "last_name": "Johnson",
  "email_address": "Albert.Johnson@example.com"
}
form_data = urllib.urlencode(form_fields)
result = urlfetch.fetch(url=url,
						payload=form_data,
						method=urlfetch.POST,
						headers={'Content-Type': 'application/x-www-form-urlencoded'})
"""


from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.api import urlfetch

class ProxyPage(webapp.RequestHandler):
	def get(self):
		self.response.out.write("No.")

	def options(self):
		self.response.headers.add_header("Access-Control-Allow-Origin", "*")
		self.response.headers.add_header("Access-Control-Allow-Methods", "POST")
		self.response.headers.add_header("Access-Control-Allow-Headers", self.request.headers.get("Access-Control-Request-Headers"))

	def post(self):
		self.response.headers.add_header("Access-Control-Allow-Origin", "*")
		result = urlfetch.fetch(url = "https://android.clients.google.com/upsj" + self.request.path_qs,
								payload = self.request.body,
								method = urlfetch.POST,
								validate_certificate = False,
								headers = {
									'Content-Type': "application/x-google-protobuf",
									'Cookie': self.request.headers.get("X-Cookie")
								})
		self.response.out.write(result.content)


application = webapp.WSGIApplication(
									 [('/.*', ProxyPage)],
									 debug=True)

def main():
	run_wsgi_app(application)

if __name__ == "__main__":
	main()