//
//  FastlaneSnapshot.swift
//  FastlaneSnapshot
//
//  Created by Steve Marreros on 11/2/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import XCTest

extension XCUIElement {
  func forceTapElement() {
    if self.isHittable {
      self.tap()
    }
    else {
      let coordinate: XCUICoordinate = self.coordinate(withNormalizedOffset: CGVector(dx:0.0, dy:0.0))
      coordinate.tap()
    }
  }
}

class FastlaneSnapshot: XCTestCase {
        
    override func setUp() {
        super.setUp()
        
        // Put setup code here. This method is called before the invocation of each test method in the class.
        
        // In UI tests it is usually best to stop immediately when a failure occurs.
        // UI tests must launch the application that they test. Doing this in setup will make sure it happens for each test method.
        let app = XCUIApplication()
        setupSnapshot(app)
        app.launch()

        // In UI tests it’s important to set the initial state - such as interface orientation - required for your tests before they run. The setUp method is a good place to do this.
      continueAfterFailure = false
      XCUIApplication().launch()
    }
    
    override func tearDown() {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
        super.tearDown()
    }
  
  
    
    func testGenerateScreenshots() {
      
      snapshot("00Launch")
      let app = XCUIApplication()
      
      snapshot("01AllowPermissions", timeWaitingForIdle: 10)
    
     
    }
    
}
