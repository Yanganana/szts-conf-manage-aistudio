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
        icon={<Users size={32} />} 
        title="团队 (Team)" 
        desc="查看团队成员的所有相关任务"
        color="text-blue-600 bg-blue-50"
        borderColor="hover:border-blue-200"
        onClick={() => setSelectedType('team')}
      />
      <TypeCard 
        icon={<FolderKanban size={32} />} 
        title="项目 (Project)" 
        desc="以项目为主视角查看任务进度"
        color="text-indigo-600 bg-indigo-50"
        borderColor="hover:border-indigo-200"
        onClick={() => setSelectedType('project')}
      />
      <TypeCard 
        icon={<CheckSquare size={32} />} 
        title="任务 (Task)" 
        desc="聚焦单条任务及其子任务"
        color="text-emerald-600 bg-emerald-50"
        borderColor="hover:border-emerald-200"
        onClick={() => setSelectedType('task')}
      />
      <TypeCard 
        icon={<TagIcon size={32} />} 
        title="标签 (Tag)" 
        desc="筛选具有特定标签的所有任务"
        color="text-amber-600 bg-amber-50"
        borderColor="hover:border-amber-200"
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
        items = MOCK_TAGS.map(t => ({ id: t.id, name: t.name, desc: '标签' }));
        title = '选择一个标签';
        break;
    }

    return (
      <div className="max-w-2xl mx-auto w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in-up">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <span className="text-indigo-600 cursor-pointer hover:underline hover:text-indigo-700 transition-colors" onClick={() => setSelectedType(null)}>
              {getTypeName(selectedType)}
            </span>
            <ChevronRight size={16} className="text-gray-400" />
            <span>{title}</span>
          </h3>
          <button 
            onClick={() => setSelectedType(null)}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-1.5 rounded-lg border border-gray-200 hover:bg-white hover:shadow-sm transition-all bg-transparent"
          >
            返回
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-2 bg-white">
          {items.map(item => (
            <button
              key={item.id}
              onClick={() => onContextSelect({ type: selectedType, id: item.id, name: item.name, description: item.desc })}
              className="w-full text-left p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 flex items-center justify-between group border-b border-gray-50 last:border-0"
            >
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{item.name}</div>
                {item.desc && <div className="text-sm text-gray-500 mt-1">{item.desc}</div>}
              </div>
              <ArrowRight className="text-gray-300 group-hover:text-indigo-500 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" size={20} />
            </button>
          ))}
          {items.length === 0 && (
            <div className="p-12 text-center text-gray-500">暂无数据</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="mb-12 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl mb-6 shadow-sm border border-gray-100">
          <LayoutGrid className="text-indigo-600" size={32} />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">工作台导航</h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto leading-relaxed">
          请选择您的工作上下文以开始。我们将根据您的选择过滤相关信息。
        </p>
      </div>

      <div className="w-full transition-all duration-300">
        {selectedType ? renderDetailSelection() : renderTypeSelection()}
      </div>
    </div>
  );
};

interface TypeCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  borderColor: string;
  onClick: () => void;
}

const TypeCard: React.FC<TypeCardProps> = ({ icon, title, desc, color, borderColor, onClick }) => (
  <button 
    onClick={onClick}
    className={`bg-white border border-gray-200 ${borderColor} rounded-2xl p-8 text-left transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-lg group w-full h-full flex flex-col shadow-sm`}
  >
    <div className={`w-14 h-14 rounded-xl ${color} flex items-center justify-center mb-6`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800">{title}</h3>
    <p className="text-gray-500 leading-relaxed group-hover:text-gray-600 transition-colors">{desc}</p>
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