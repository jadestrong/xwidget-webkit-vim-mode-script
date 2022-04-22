(() => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
  const currentLinkItems = []

  function getPathTo(element) {
    if (element.id!=='')
      return 'id("'+element.id+'")';
    if (element===document.body)
      return element.tagName;

    var ix= 0;
    var siblings= element.parentNode.childNodes;
    for (var i= 0; i<siblings.length; i++) {
      var sibling= siblings[i];
      if (sibling===element)
        return getPathTo(element.parentNode)+'/'+element.tagName+'['+(ix+1)+']';
      if (sibling.nodeType===1 && sibling.tagName===element.tagName)
        ix++;
    }
  }
  function lookupElementByXPath(path) {
    var evaluator = new XPathEvaluator();
    var result = evaluator.evaluate(path, document.documentElement, null,XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return  result.singleNodeValue;
  }

  function getNextKeyCombination(index) {
    let halfIndex = Math.floor(alphabet.length / 2);
    if (index < halfIndex) {
      return alphabet[index];
    } else {
      index -= halfIndex;
      return alphabet[Math.floor(index / alphabet.length) + halfIndex] + alphabet[index % alphabet.length];
    }
  }

  function createLinkItem (link, rect, key) {
    var item = document.createElement('span')
    item.setAttribute('style', 'position: absolute; padding: 1px 3px 0px 3px; background-color: yellow; color: black; z-index: 9999; font-family: Helvetica, Arial, sans-serif;font-weight: bold;font-size: 12px; background: linear-gradient(to bottom, #FFF785 0%,#FFC542 100%); border: solid 1px #C38A22; border-radius: 3px; box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.3);')

    item.textContent = key

    item.style.top = (window.scrollY + rect.top) + 'px'
    item.style.left = (window.scrollX + rect.left) + 'px'

    return item
  }

  function isVisible (rect) {
    return (
      rect.top > 0 &&
        rect.top < window.innerHeight &&
        rect.left > 0 &&
        rect.left < window.innerWidth
    )
  }

  function showLinkKeys() {
    const links = [];
    const linkRects = [];
    const xpaths = [];

    [].slice.call(document.querySelectorAll('a, button, input, textarea, select')).forEach(function (link) {
      var rect = link.getBoundingClientRect()
      if (isVisible(rect)) {
        links.push(link)
        xpaths.push(getPathTo(link));
        linkRects.push(rect)
      }
    })
    console.log(xpaths.map(xpath => lookupElementByXPath(xpath)));

    links.forEach(function (link, i) {
      var key = getNextKeyCombination(currentLinkItems.length)
      var item = createLinkItem(link, linkRects[i], key)
      currentLinkItems.push({
        link: link,
        element: item,
        key: key
      })
      document.body.appendChild(item)
    })
  }
  showLinkKeys();
})();
