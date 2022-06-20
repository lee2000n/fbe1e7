
exports.PatchRequest = (url,postId) => {
    if(postId)
    {
  // sending PUT request with fetch API in javascript
  fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    method: "PATCH",    
 
    // Fields that to be updated are passed
    body: JSON.stringify({
            authorIds:postId,
            tags: ["health", "tech"],
            text: 'Some long blog post text here.'
    })
  })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
      console.log(data);
    });
}
else{
    console.log("no id found");
  }
};
