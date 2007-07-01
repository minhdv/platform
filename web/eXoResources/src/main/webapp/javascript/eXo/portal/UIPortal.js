function UIComponent(node) {
  this.node = node ;
  this.type = node.className ;
  children =  eXo.core.DOMUtil.getChildrenByTagName(node, "div") ;
  this.metaData =  children[0] ;
  this.control = children[1] ; 
  this.layout = children[2] ; 
  this.view = children[3] ; 
  this.component = "";
  
  var div = eXo.core.DOMUtil.getChildrenByTagName(this.metaData, "div"); 
  this.id = div[0].firstChild.nodeValue ;
  this.title = div[1].firstChild.nodeValue ;
  this.description = div[2].firstChild.nodeValue ;
};

UIComponent.prototype.getId = function() { return this.id ; };
UIComponent.prototype.getTitle = function() { return this.title ; };
UIComponent.prototype.getDescription = function() { return this.description ; };
UIComponent.prototype.getElement = function() { return this.node ; };
UIComponent.prototype.getUIComponentType = function() { return this.type ; };

UIComponent.prototype.getUIComponentBlock = function() { return this.node ; };
UIComponent.prototype.getControlBlock = function() { return this.control ; };
UIComponent.prototype.getLayoutBlock = function() { return this.layout ; };
UIComponent.prototype.getViewBlock = function() { return this.view ; };

/*******************************************************************************/

function UIPortal() {
  this.portalUIComponentDragDrop = false;
};

UIPortal.prototype.getUIPortlets = function() {
  var uiWorkingWorkspace = document.getElementById("UIWorkingWorkspace") ;
  var founds =  eXo.core.DOMUtil.findDescendantsByClass(uiWorkingWorkspace, "div", "UIPortlet") ;
  components =  new Array() ;
  for(j = 0; j < founds.length; j++) {
    components[components.length] = new UIComponent(founds[j]) ;
  }
  return components ;
} ;

UIPortal.prototype.getUIPortletsInUIPortal = function() {
  var uiWorkingWorkspace = document.getElementById("UIWorkingWorkspace") ;
  var founds =  eXo.core.DOMUtil.findDescendantsByClass(uiWorkingWorkspace, "div", "UIPortlet") ;
  components =  new Array() ;
  for(var j = 0; j < founds.length; j++) {
    if(eXo.core.DOMUtil.findAncestorByClass(founds[j], 'UIPage') == null) {
      components[components.length] = new UIComponent(founds[j]) ;
    }
  }
  return components ;
} ;

UIPortal.prototype.getUIPortletsInUIPage = function() {
  var uiPage = document.getElementById("UIPage") ;
  var founds =  eXo.core.DOMUtil.findDescendantsByClass(uiPage, "div", "UIPortlet");
  components =  new Array() ;
  for(j = 0; j < founds.length; j++) {
    components[components.length] = new UIComponent(founds[j]) ;
  }
  return components ;
} ;

UIPortal.prototype.getUIContainers = function() {
  var uiWorkingWorkspace = document.getElementById("UIWorkingWorkspace") ;
  var  founds = eXo.core.DOMUtil.findDescendantsByClass(uiWorkingWorkspace, "div", "UIContainer");
  components =  new Array() ;
  for(var j = 0; j < founds.length; j++) {
    components[j] = new UIComponent(founds[j]) ;
  }
  return components ;
};

UIPortal.prototype.getUIPage = function() {
  var uiPortal = document.getElementById("UIPortal") ;
  return new UIComponent(eXo.core.DOMUtil.findFirstDescendantByClass(uiPortal, "div", "UIPage")) ;
};

UIPortal.prototype.getUIPortal = function() {
  var uiWorkingWorkspace = document.getElementById("UIWorkingWorkspace") ;
  return new UIComponent(eXo.core.DOMUtil.findFirstDescendantByClass(uiWorkingWorkspace, "div", "UIPortal"));
};

UIPortal.prototype.switchViewModeToLayoutMode = function(uicomponent, swapContent) {
  var layoutBlock = uicomponent.getLayoutBlock() ;
  if(layoutBlock.style.display == 'block') return ;
  var viewBlock = uicomponent.getViewBlock() ;
  if(swapContent) {
    contentNode = eXo.core.DOMUtil.findDescendantById(viewBlock, uicomponent.getId()) ;
    if(contentNode != null) {
      viewBlock.removeChild(contentNode) ;
      layoutBlock.appendChild(contentNode) ;
    }
  }
  
  try {
	  viewBlock.style.display = "none" ;
  	layoutBlock.style.display = "block" ;
  	
  	if((layoutBlock.className == "LAYOUT-CONTAINER") && (layoutBlock.offsetHeight < 30)) {
  		var uiRowContainer = eXo.core.DOMUtil.findFirstDescendantByClass(layoutBlock, "div", "UIRowContainer");
  		if(uiRowContainer.innerHTML == "") layoutBlock.style.height = "60px" ;
  	}
  } catch (err) {
  	//alert(uicomponent.getId() + ":" + err.toString()) ; //Debug
  }
  
//  this.switchPageMode(uicomponent, "layoutMode");
};

UIPortal.prototype.switchLayoutModeToViewMode = function(uicomponent, swapContent) {
  var viewBlock =  uicomponent.getViewBlock() ;
  if(viewBlock.style.display == 'block') return ;
  var layoutBlock = uicomponent.getLayoutBlock() ;
  if(swapContent) {
    contentNode = eXo.core.DOMUtil.findDescendantById(layoutBlock, uicomponent.getId()) ;
    if(contentNode != null) {
      layoutBlock.removeChild(contentNode) ;
      viewBlock.appendChild(contentNode) ;
    }
  }
  viewBlock.style.display = "block" ;
  layoutBlock.style.display = "none" ;
} ;

//UIPortal.prototype.switchPageMode = function(uicomponent, mode) {
//	var viewBlock = uicomponent.getViewBlock ;
//	if(viewBlock.className == "VIEW-PAGE") {
//		if(mode == "layoutMode") {
//			viewBlock.style.border = "solid 2px red" ;
//			viewBlock.style.padding = "10px" ;
//		} else {
//			viewBlock.style.border = "none" ;
//			viewBlock.style.padding = "0px" ;
//			
//		}
//	}
//	
//}

UIPortal.prototype.switchMode = function(elemtClicked) {
	if(elemtClicked.className == "Icon PreviewIcon") {
		elemtClicked.className = "Icon LayoutModeIcon" ;
		this.showViewMode() ;
		this.showMaskLayer() ;
//		eXo.core.Browser.onScrollCallback("", eXo.portal.UIPortal.showMaskLayer()) ;
	} else {
		this.hideMaskLayer() ;
		elemtClicked.className = "Icon PreviewIcon" ;
		this.showLayoutModeForPortal() ;
	}
	eXo.portal.PortalDragDrop.fixCss();
} ;

UIPortal.prototype.switchModeForPage = function(elemtClicked) {
	this.showViewLayoutModeForPage();
	if(elemtClicked.className == "Icon PagePreviewIcon") {
		elemtClicked.className = "Icon PageLayoutModeIcon" ;
		this.showMaskLayer() ;
	} else {
		elemtClicked.className = "Icon PagePreviewIcon" ;
		this.hideMaskLayer() ;
	}
} ;

UIPortal.prototype.showUIComponentControl = function(uicomponent, flag) {
  var controlBlock = uicomponent.getControlBlock() ;
  var clickObject = eXo.core.DOMUtil.findFirstDescendantByClass(controlBlock, "div", "DragControlArea") ;
  if(flag) {
    clickObject.onmousedown = eXo.portal.PortalDragDrop.init ;
    controlBlock.style.display = 'block' ;
  } else {
    controlBlock.onmousedown = null ;
    controlBlock.style.display = 'none' ;
  }
};

UIPortal.prototype.showViewLayoutModeForPage = function() {
  var container = this.getUIContainers() ;
  for(var i = 0; i < container.length; i++) {
  	var viewBlock = container[i].getViewBlock() ;
  	if(viewBlock.style.display == '') {
  		viewBlock.style.display = 'block';
  	}
    if(viewBlock.style.display == 'block') {
    	this.switchViewModeToLayoutMode(container[i], true) ;
      this.showUIComponentControl(container[i], this.component == 'UIContainer') ;
    } else {
    	this.switchLayoutModeToViewMode(container[i], true) ;
    	this.showUIComponentControl(container[i], false) ;
    }
  }

  var portlet = this.getUIPortletsInUIPage() ;
  for(var i = 0; i < portlet.length; i++) {
  	var viewBlock = portlet[i].getViewBlock() ;
  	if(viewBlock.style.display == '') {
  		viewBlock.style.display = 'block';
  	}
    if(viewBlock.style.display == 'block') {
    	this.switchViewModeToLayoutMode(portlet[i], false) ;
    	this.showUIComponentControl(portlet[i], this.component == 'UIPortlet') ;
    } else {
    	this.switchLayoutModeToViewMode(portlet[i], false) ;
    	this.showUIComponentControl(portlet[i], false) ;
    }
  }
} ;

  /**Repaired: by Vu Duy Tu 25/04/07**/
UIPortal.prototype.showLayoutModeForPage = function(control) {
	var uiPage = eXo.core.DOMUtil.findFirstDescendantByClass(document.body, "div", "UIPage") ;
	if(uiPage == null) return;
	var viewPage = eXo.core.DOMUtil.findFirstDescendantByClass(uiPage, "div", "VIEW-PAGE") ;
	var uiPageDesktop = document.getElementById("UIPageDesktop") ;
	var uiPortalApplication = document.getElementById("UIPortalApplication");
	if(uiPortalApplication.className != "Vista") {
	 viewPage.style.border = "solid 3px #dadada" ;
	}
	viewPage.style.padding = "50px 0px" ;
		
	if(control) this.component = control ;
	var container = this.getUIContainers() ;
  for(var i = 0; i < container.length; i++) {
    this.switchViewModeToLayoutMode(container[i], true) ;
    this.showUIComponentControl(container[i], this.component == 'UIContainer') ;

	  var uiContainer = eXo.core.DOMUtil.findFirstDescendantByClass(viewPage, "div", "UIContainer") ;
	  if(uiContainer != null) {
	  	viewPage.style.border = "none" ;
	  	viewPage.style.padding = "8px 5px 3px 3px;" ;
	  }
  }
	
	var portlet = this.getUIPortletsInUIPage() ;
  for(var i = 0; i < portlet.length; i++) {
    this.switchViewModeToLayoutMode(portlet[i], false) ;
    this.showUIComponentControl(portlet[i], this.component == 'UIPortlet') ;
    
	  var uiPortlet = eXo.core.DOMUtil.findFirstDescendantByClass(viewPage, "div", "UIPortlet") ;
	  if(uiPortlet != null) {
	  	viewPage.style.border = "none" ;
	  	viewPage.style.padding = "8px 5px 3px 3px;" ;
	  }
  }
};

UIPortal.prototype.showViewMode = function() {
  var portal = this.getUIPortal() ;
  this.switchLayoutModeToViewMode(portal, true) ;
  this.showUIComponentControl(portal, false) ;
  
  var uiPageDesktop = document.getElementById("UIPageDesktop") ;
  if(!uiPageDesktop) {
  	var page = this.getUIPage() ;
  	this.switchLayoutModeToViewMode(page, true) ;
  	this.showUIComponentControl(page, false) ;
  }

  var container = this.getUIContainers() ;
  for(var i = 0; i < container.length; i++) {
    this.switchLayoutModeToViewMode(container[i], true) ;
    this.showUIComponentControl(container[i], false) ;
  }

  var portlet  = this.getUIPortletsInUIPortal() ;
  for(var i = 0; i < portlet.length; i++) {
    this.switchLayoutModeToViewMode(portlet[i], false) ;
    this.showUIComponentControl(portlet[i], false) ;
  }
};

UIPortal.prototype.showLayoutModeForPortal = function(control) {
	if(control) this.component = control;
	//var containerTest = document.getElementById("UIContainerTest");
	//var childTest = document.getElementById("UIPortlet-banner");
	//alert("Container: "+ containerTest.id + "   Child: "+ childTest.id);
	//eXo.core.DragDrop.isAncestor(childTest, containerTest);
//	var uiPageDesktop = document.getElementById("UIPageDesktop") ;
	/*If Current page is page desktop, can not switch to portal layout mode*/
//	if(uiPageDesktop) return ;
	
  var portal = this.getUIPortal() ;
  this.switchViewModeToLayoutMode(portal, true) ;
  this.showUIComponentControl(portal, this.component == 'UIPortal') ;

  var page = this.getUIPage() ;
  this.switchViewModeToLayoutMode(page, false) ;
  this.showUIComponentControl(page, this.component == 'UIPage') ;

  var container = this.getUIContainers() ;
  for(var i = 0; i < container.length; i++) {
    this.switchViewModeToLayoutMode(container[i], true) ;
    this.showUIComponentControl(container[i], this.component == 'UIContainer') ;
  }
    
	var portlet  = this.getUIPortletsInUIPortal() ;
  for(var i = 0; i < portlet.length; i++) {
    this.switchViewModeToLayoutMode(portlet[i], false) ;
    this.showUIComponentControl(portlet[i], this.component == 'UIPortlet') ;
  }  
} ;

UIPortal.prototype.findUIComponentOf = function(element) {
  var parent = element.parentNode ;
  while(parent != null) {
    var className = parent.className ;
    if(className == 'UIPortlet' || className == 'UIContainer' ||  
       className == 'UIPage' ||  className == 'UIPortal')  {
      return parent ;
    }
    parent = parent.parentNode ;
  }
  return null ;
};

UIPortal.prototype.showMaskLayer = function() {
	var uiPortalApplication = document.getElementById("UIPortalApplication") ;
	var object = document.createElement("div") ;
	object.className = "PreviewMode" ;
	object.style.display = "none" ;
	object.title = "Click here to turn off preview mode";
	uiPortalApplication.appendChild(object) ;
	 
	object.onclick = function() {
		var layoutModeIcon = eXo.core.DOMUtil.findFirstDescendantByClass(uiPortalApplication, "a", "LayoutModeIcon") ;
		var pageLayoutModeIcon = eXo.core.DOMUtil.findFirstDescendantByClass(uiPortalApplication, "a", "PageLayoutModeIcon") ;
		
		if(layoutModeIcon) {
			eXo.portal.UIPortal.switchMode(layoutModeIcon) ;
		}
		
		if(pageLayoutModeIcon) {
			eXo.portal.UIPortal.switchModeForPage(pageLayoutModeIcon) ;
		}
	}
	
	this.maskLayer = eXo.core.UIMaskLayer.createMask("UIPortalApplication", object, 30, "TOP-RIGHT") ;
	eXo.core.Browser.addOnScrollCallback("3743892", eXo.core.UIMaskLayer.setPosition) ;
} ;

UIPortal.prototype.hideMaskLayer = function() {
	if(this.maskLayer) {
		var uiPortalApplication = document.getElementById("UIPortalApplication") ;
		eXo.core.UIMaskLayer.removeMask(this.maskLayer) ;
		this.maskLayer = null ;
		var maskObject = eXo.core.DOMUtil.findFirstDescendantByClass(uiPortalApplication, "div", "PreviewMode") ;
		uiPortalApplication.removeChild(maskObject) ;
	}
} ;

UIPortal.prototype.changeSkin = function(url) {
	var skin = '';
	if(eXo.webui.UIItemSelector.SelectedItem != undefined) {
  	skin = eXo.webui.UIItemSelector.SelectedItem.option;
	}
	if(skin == undefined) skin = '';
  window.location = url + '&skin='+skin;
} ;

UIPortal.prototype.changeLanguage = function(url) {
	var language = '';
	if(eXo.webui.UIItemSelector.SelectedItem != undefined) {
  	language = eXo.webui.UIItemSelector.SelectedItem.option;
	}
	if(language == undefined) language = '';  
  window.location = url + '&language='+language;
} ;

UIPortal.prototype.changePortal = function(accessPath, portal) {
  window.location = eXo.env.server.context + "/" + accessPath + "/" + portal+"/";
} ;

/** Created: by Lxchiati **/

UIPortal.prototype.popupButton = function(url, action) {
	if(action == undefined) action = '';  
	var objectId = '';
  window.location = url + '&action='+ action ;
} ;

/** Created: by Duy Tu **/
UIPortal.prototype.onLoads = function() {
	DOMUtil = eXo.core.DOMUtil;
	var tabContents = document.getElementById("TabContents") ;
	var uiTabContent = DOMUtil.findDescendantsByClass(tabContents, "div", "UITabContent");
	if(uiTabContent.length > 0) {
		for(var i = 0;i < uiTabContent.length; ++i ){
			var uiInfoBar = DOMUtil.findFirstDescendantByClass(uiTabContent[i], "div", "UIInfoBar") ;
			var layOutContainer = DOMUtil.findFirstDescendantByClass(uiTabContent[i], "div", "LAYOUT-CONTAINER") ;
			if(uiInfoBar) uiInfoBar.style.display = "none";
			if(layOutContainer) {
				layOutContainer.style.border = "none";
			  layOutContainer.style.background = "none";
			}
			if (eXo.webui.UIHorizontalTabs) {
				if (eXo.webui.UIHorizontalTabs.currentTab == i) {
					var uiTabContainer = eXo.core.DOMUtil.findAncestorByClass(uiTabContent[i], "UITabContainer");
					var tabs = eXo.core.DOMUtil.findDescendantsByClass(uiTabContainer, "div", "UITab");
					eXo.webui.UIHorizontalTabs.displayTabContent(tabs[i].firstChild);
				}
			}
		}
	}
} ;

UIPortal.prototype.createJSApplication = function(application, applicationId, instanceId, appLocation) {
	if(application) {
		eXo.require(application, appLocation); 
		var createApplication = application + '.initApplication(\''+applicationId+'\',\''+instanceId+'\');' ;
//	alert(createApplication);
//  error: double load;
//  uoon
	  eval(createApplication);
	}
} ;

eXo.portal.UIPortalComponent = UIComponent.prototype.constructor ;
eXo.portal.UIPortal = new UIPortal() ;
eXo.portal.UIComponent = UIPortal.prototype.constructor ;
