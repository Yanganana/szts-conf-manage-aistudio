import React, { useState } from 'react';
import { Users, FolderKanban, CheckSquare, Tag as TagIcon, ArrowRight, ChevronRight, LayoutGrid } from 'lucide-react';
import { MOCK_PROJECTS, MOCK_TAGS, MOCK_TASKS, MOCK_TEAMS } from '../constants';
import { WorkbenchContext, WorkbenchContextType } from '../types';

interface GuideLayerProps {
  onContextSelect: (context: WorkbenchContext) => void;
}

const GuideLayer: React.FC<GuideLayerProps> = ({ onContextSelect }) => {
  const [selectedType, setSelectedType] = useState<WorkbenchContextType | null>(null);

  const renderTypeSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto px-4">
      <TypeCard 
        icon={<Users size={48} />} 
        title="团队 (Team)" 
        desc="查看团队成员的所有相关任务"
        color="bg-blue-500"
        onClick={() => setSelectedType('team')}
      />
      <TypeCard 
        icon={<FolderKanban size={48} />} 
        title="项目 (Project)" 
        desc="以项目为主视角查看任务进度"
        color="bg-indigo-500"
        onClick={() => setSelectedType('project')}
      />
      <TypeCard 
        icon={<CheckSquare size={48} />} 
        title="任务 (Task)" 
        desc="聚焦单条任务及其子任务"
        color="bg-emerald-500"
        onClick={() => setSelectedType('task')}
      />
      <TypeCard 
        icon={<TagIcon size={48} />} 
        title="标签 (Tag)" 
        desc="筛选具有特定标签的所有任务"
        color="bg-amber-500"
        onClick={() => setSelectedType('tag')}
      />
    </div>
  );

  const renderDetailSelection = () => {
    if (!selectedType) return null;

    let items: { id: string; name: string; desc?: string }[] = [];
    let title = '';

    switch (selectedType) {
      case 'team':
        items = MOCK_TEAMS.map(t => ({ id: t.id, name: t.name, desc: t.description }));
        title = '选择一个团队';
        break;
      case 'project':
        items = MOCK_PROJECTS.map(p => ({ id: p.id, name: p.name, desc: p.description }));
        title = '选择一个项目';
        break;
      case 'task':
        // Only show parent tasks to avoid clutter, or all tasks
        items = MOCK_TASKS.map(t => ({ id: t.id, name: t.title, desc: `${t.status} - ${t.priority}` }));
        title = '选择一条任务';
        break;
      case 'tag':
        items = MOCK_TAGS.map(t => ({ id: t.id, name: t.name, desc: 'Label' }));
        title = '选择一个标签';
        break;
    }

    return (
      <div className="max-w-2xl mx-auto w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in-up">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-indigo-600 cursor-pointer hover:underline" onClick={() => setSelectedType(null)}>
              {getTypeName(selectedType)}
            </span>
            <ChevronRight size={16} className="text-gray-400" />
            <span>{title}</span>
          </h3>
          <button 
            onClick={() => setSelectedType(null)}
            className="text-sm text-gray-500 hover:text-gray-800 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
          >
            返回
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => onContextSelect({ type: selectedType, id: item.id, name: item.name, description: item.desc })}
              className="w-full text-left p-4 hover:bg-indigo-50 rounded-xl transition-all duration-200 flex items-center justify-between group border-b border-gray-50 last:border-0"
            >
              <div>
                <div className="font-medium text-gray-900 group-hover:text-indigo-700">{item.name}</div>
                {item.desc && <div className="text-sm text-gray-500 mt-1">{item.desc}</div>}
              </div>
              <ArrowRight className="text-gray-300 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all" size={20} />
            </button>
          ))}
          {items.length === 0 && (
            <div className="p-8 text-center text-gray-500">暂无数据</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 bg-opacity-95 backdrop-blur-sm flex flex-col items-center justify-center p-4">
      <div className="mb-12 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-4 ring-1 ring-white/20">
          <LayoutGrid className="text-white" size={32} />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">工作台导航</h1>
        <p className="text-slate-300 text-lg max-w-xl mx-auto">
          请选择您的工作上下文以开始。我们将根据您的选择过滤相关信息。
        </p>
      </div>

      <div className="w-full transition-all duration-300">
        {selectedType ? renderDetailSelection() : renderTypeSelection()}
      </div>
    </div>
  );
};

const TypeCard: React.FC<{ icon: React.ReactNode; title: string; desc: string; color: string; onClick: () => void }> = ({ icon, title, desc, color, onClick }) => (
  <button 
    onClick={onClick}
    className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-2xl p-8 text-left transition-all duration-300 hover:transform hover:-translate-y-1 group w-full h-full flex flex-col"
  >
    <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:shadow-${color}/50`}>
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-400 group-hover:text-slate-200 transition-colors">{desc}</p>
  </button>
);

const getTypeName = (type: WorkbenchContextType) => {
  switch (type) {
    case 'team': return '团队';
    case 'project': return '项目';
    case 'task': return '任务';
    case 'tag': return '标签';
    default: return type;
  }
};

export default GuideLayer;