# Disposamail

Disposamail is a simple application that randomly generates a username and allows mail to be sent to that username _while the user maintains a connection with Disposamail_. Once the user disconnects, that username is released and the server will no longer accept mail for that address. Mail is displayed to the user in their web browser. Currently, [Mandrill](https://mandrillapp.com/) by [MailChimp](http://mailchimp.com/) is used for processing of incoming email however other providers can be added.

## Project Location

A public instance of this project is hosted on [Heroku](https://www.heroku.com/) at [disposamail.net](http://disposamail.net/), and the source code is primary hosted on [GitLab](https://gitlab.com/petris/disposamail-ext). If you're browsing this source on GitHub or any other location, please visit [gitlab.com/petris/disposamail-ext](https://gitlab.com/petris/disposamail-ext) to get the latest copy. There is also another version of Disposamail at [gitlab.com/petris/disposamail](https://gitlab.com/petris/disposamail) which uses Haraka to process incoming emails internally rather than using a third-party service.


## License

Disposamail is licensed under the GNU Affero General Public License Version 3. A copy of this license is available in the LICENSE file.