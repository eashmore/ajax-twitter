var FollowToggle = function(el) {
  this.el = el;
  this.userId = el.dataset.userId;

  this.render = function() {
    this.el.removeAttribute('disabled');
    if (this.el.dataset.followState === "followed") {
      this.el.innerHTML = "Unfollow!";
    } else if (this.el.dataset.followState === 'unfollowed') {
      this.el.innerHTML = "Follow!";
    } else {
      this.el.innerHTML = "loading...";
      this.el.setAttribute('disabled', true);
    }
  };

  this.handleClick = function(event) {
    event.preventDefault();

    var requestType;
    if (this.el.dataset.followState === 'followed') {
      requestType = 'DELETE';
    } else if (this.el.dataset.followState === 'unfollowed') {
      requestType = 'POST';
    }

    this.el.dataset.followState = 'changeState';
    this.render();

    var url = "/users/" + this.userId + "/follow";
    var httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = function () {
      if (httpRequest.readyState === 4) {
        if (httpRequest.status === 200) {
          if (requestType === "DELETE") {
            this.el.dataset.followState = 'unfollowed';
          } else {
            this.el.dataset.followState = 'followed';
          }

          this.render();
        } else {
          alert('Could not follow/unfollow');
        }
      }
    }.bind(this);

    httpRequest.open(requestType, url);
    httpRequest.setRequestHeader('X-CSRF-Token', AUTH);
    httpRequest.send();

  };

  this.el.addEventListener("click", this.handleClick.bind(this));

};

function followToggle(htmlCollection) {
  for (var i = 0; i < htmlCollection.length; i++) {
    var el = new FollowToggle(htmlCollection[i]);
    el.render();
  }
}

document.addEventListener("DOMContentLoaded", function() {
    var followButtons = document.querySelectorAll('button.follow-toggle');
    followToggle(followButtons);
  }
);
