$.get(document.currentScript.getAttribute("data-index"))
  .done(function(documents) {
    var index = lunr(function() {
      this.ref("uri");
      this.field("title", { boost: 10 });
      this.field("content");
      documents.map(function(doc) {
        this.add(doc);
      }, this);
    });
    $("#search").keyup(function(e) {
      if (e.which !== 13) {
        return;
      }
      var results = index.search(this.value),
        docs = results.slice(0, 5).map(function(result) {
          return documents.filter(function(doc) {
            return doc.uri == result.ref;
          })[0];
        });

      var modal_body = $(".modal-body");
      modal_body.children().remove();
      docs.forEach(function(doc) {
        $("<p>")
          .append(
            $("<a>")
              .attr("href", doc.uri)
              .text(doc.title)
          )
          .append($("<span style='display: block;'>").text(doc.author))
          .append(
            $("<span style='display: block;'>").text("Issue " + doc.issue)
          )
          .appendTo(modal_body);
      });

      $("#search-modal .close").click(function() {
        $("#search-modal").addClass("hide");
      });

      $("#search-modal").removeClass("hide");
      $(document).keydown(function(e) {
        if (e.which === 27) {
          $("#search-modal").addClass("hide");
        }
      });
    });
  })
  .error(function(e) {
    console.log("Couldn't load index.json");
    console.log(e);
  });
