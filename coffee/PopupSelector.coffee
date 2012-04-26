# Shortcuts

mix = () -> #複数のオブジェクトの要素を結合、上書きする
  child = {}
  for arg in arguments
    for prop of arg
      if arg.hasOwnProperty prop
        child[prop] = arg[prop]
  return child

$$ = 
  
  window: 
    tabBarHidden: true
    navBarHidden: true
  
  tableView: 
    top: 44
    rowHeight: 44
    borderRadius: 4
    borderWidth: 2      
    borderColor: '#222'      
  
  tableViewRow: 
    height: 44
        
  maskView:
    top: 0
    height: Ti.UI.FILL
    width: Ti.UI.FILL
    backgroundColor: '#000'      
    opacity: 0.5

  container:
    top: 100
    height: 340
    width: 260
    backgroundColor: '#444'
    # backgroundGradient:
      # type:'linear'
      # colors: [{ color: '#505050', position: 0.0 }, { color: '#292929', position: 0.1}, { color: '#292929', position: 1.0}]
      # backFillStart:false        
    borderRadius: 5
    borderWidth: 2      
    borderColor: '#222'      
    opacity: 0.85

  doneBtn: 
    top: 8
    right: 10
    width: 50
    height: 30
  
  titleLabel:
    top: 10
    height: 25
    width: 180
    textAlign: 'center'
    color: '#fff'
    font: 
      fontFamily: 'Helvetica-Bold'
      fontSize: 18
      fontWeight: 'BOLD'


class PopupSelector        
  constructor: (options = {})->
    
    # Local Variables

    defaults = 
      title: ''
      choice: []
      selected: 0
      closeWhenTouchOutside: true
      closeAfterSelect: true
      doneButton: false
      doneButtonTitle: 'Done'
      
    params = mix defaults, options


    # Instance Variables

    @listeners = {}

      
    # UI

    @window = Ti.UI.createWindow
      opacity: 0
      
    maskView = Ti.UI.createView $$.maskView
    @window.add maskView
      
    if params.closeWhenTouchOutside
      maskView.addEventListener 'click', (e)=>
        @hide()      
        return

    container = Ti.UI.createView $$.container
    @window.add container
                
    titleLabel = Ti.UI.createLabel mix $$.titleLabel,
      text: params.title
    container.add titleLabel

    tableView = Ti.UI.createTableView mix $$.tableView,
      height: container.height - 49
    container.add tableView
    
    rows = []
    for item, i_ in params.choice
      rows.push Ti.UI.createTableViewRow mix $$.tableViewRow,
        title: item
        hasCheck: i_ is params.selected && true || false
    tableView.setData rows
          
    tableView.addEventListener 'click', (e)=>
      tableView.data[0].rows[params.selected].hasCheck = false
      tableView.data[0].rows[e.index].hasCheck = true
      params.selected = e.index
      @fireEvent 'click', e
      if params.closeAfterSelect
        @hide()      
      return

      
    if params.doneButton
      doneBtn = Ti.UI.createButton mix $$.doneBtn,
        title: params.doneButtonTitle
      container.add doneBtn        
      doneBtn.addEventListener 'click', (e)=>
        @hide()      
        return

    return
  
  show: (animate = true)->
    if animate
      @window.open()
      @window.animate {opacity: 1, duration: 300}
    else
      @window.open()
    return
  
  hide: (animate = true)->
    if animate
      @window.animate {opacity: 0, duration: 300}, ()=>
        @window.close()
        return
    else
      @window.close()
    return
  
  addEventListener: (eventName, callback)->
    @listeners = @listeners || {}
    @listeners[eventName] = @listeners[eventName] || []
    @listeners[eventName].push callback
    return
  
  fireEvent: (eventName, data)->
    eventListeners = @listeners[eventName] || []
    for event in eventListeners
      event.call this, data
    return

module.exports = PopupSelector


