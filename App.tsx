import React, { useState } from 'react';
import GuideLayer from './components/GuideLayer';
import Workbench from './components/Workbench';
import { WorkbenchContext } from './types';

const App: React.FC = () => {
  // Application State
  const [context, setContext] = useState<WorkbenchContext | null>(null);

  const handleContextSelect = (ctx: WorkbenchContext) => {
    setContext(ctx);
  };

  const handleBackToGuide = () => {
    setContext(null);
  };

  return (
    <div className="relative min-h-screen">
      {/* 
        3.1 增加引导图层，打开该菜单后，默认先进入引导图层
        Conditional rendering based on whether a context is selected.
      */}
      {!context ? (
        <GuideLayer onContextSelect={handleContextSelect} />
      ) : (
        <Workbench context={context} onBack={handleBackToGuide} />
      )}
    </div>
  );
};

export default App;