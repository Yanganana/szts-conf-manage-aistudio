import React, { useMemo, useState } from 'react';
import { WorkbenchContext, Task, Status, Priority } from '../types';
import { MOCK_TASKS, MOCK_USERS, MOCK_TAGS, MOCK_TEAMS, MOCK_PROJECTS } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Calendar, AlertCircle, CheckCircle2, Circle, Clock, Tag as TagIcon, Sparkles, User as UserIcon } from 'lucide-react';
import { generateTaskSummary } from '../services/geminiService';

interface WorkbenchProps {
  context: WorkbenchContext;
  onBack: () => void;
}

const Workbench: React.FC<WorkbenchProps> = ({ context, onBack }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // 3.2, 3.3, 3.4, 3.5 Filtering Logic
  const filteredTasks = useMemo(() => {
    switch (context.type) {
      case 'project':
        // 3.2 Project: Filter by project ID
        return MOCK_TASKS.filter(t => t.projectId === context.id);
      
      case 'team':
        // 3.5 Team: Find team members, then find tasks assigned to OR reported by them
        const teamMemberIds = MOCK_USERS.filter(u => u.teamId === context.id).map(u => u.id);
        return MOCK_TASKS.filter(t => 
          (t.assigneeId && teamMemberIds.includes(t.assigneeId)) || 
          teamMemberIds.includes(t.reporterId)
        );

      case 'task':
        // 3.3 Task: Current task + subtasks
        return MOCK_TASKS.filter(t => t.id === context.id || t.parentId === context.id);

      case 'tag':
        // 3.4 Tag: Filter by tag inclusion
        return MOCK_TASKS.filter(t => t.tagIds.includes(context.id));
      
      default:
        return [];
    }
  }, [context]);

  const stats = useMemo(() => {
    const statusCounts = {
      [Status.TODO]: 0,
      [Status.IN_PROGRESS]: 0,
      [Status.REVIEW]: 0,
      [Status.DONE]: 0,
    };
    filteredTasks.forEach(t => statusCounts[t.status]++);
    return [
      { name: '待办', value: statusCounts[Status.TODO], color: '#9ca3af' }, // gray-400
      { name: '进行中', value: statusCounts[Status.IN_PROGRESS], color: '#3b82f6' }, // blue-500
      { name: '审核中', value: statusCounts[Status.REVIEW], color: '#f59e0b' }, // amber-500
      { name: '已完成', value: statusCounts[Status.DONE], color: '#10b981' }, // emerald-500
    ];
  }, [filteredTasks]);

  const handleGenerateSummary = async () => {
    setLoadingAi(true);
    const result = await generateTaskSummary(filteredTasks, context.name);
    setSummary(result);
    setLoadingAi(false);
  };

  const getStatusIcon = (status: Status) => {
    switch(status) {
      case Status.DONE: return <CheckCircle2 size={16} className="text-emerald-500" />;
      case Status.IN_PROGRESS: return <Clock size={16} className="text-blue-500" />;
      case Status.REVIEW: return <AlertCircle size={16} className="text-amber-500" />;
      default: return <Circle size={16} className="text-gray-300" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 text-white p-2 rounded-lg shadow-sm">
             <LayoutIcon type={context.type} />
          </div>
          <div>
            <div className="flex items-center gap-2">
               <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                 {getContextTypeLabel(context.type)}
               </span>
               <h1 className="text-xl font-bold text-gray-900">{context.name}</h1>
            </div>
            {context.description && <p className="text-sm text-gray-500 mt-0.5">{context.description}</p>}
          </div>
        </div>
        <div className="flex gap-3">
          <button 
             onClick={handleGenerateSummary}
             disabled={loadingAi || filteredTasks.length === 0}
             className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
          >
            <Sparkles size={18} />
            {loadingAi ? '分析中...' : 'AI 智能分析'}
          </button>
          <button 
            onClick={onBack}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-gray-900 hover:border-gray-400 transition-all text-sm font-medium shadow-sm"
          >
            切换视角
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* AI Summary Section */}
          {summary && (
            <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm animate-fade-in relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
               <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
                 <Sparkles className="text-purple-600" size={20} />
                 智能分析报告
               </h3>
               <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{summary}</p>
            </div>
          )}

          {/* Stats Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-800 mb-4">任务状态分布</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 text-xs text-gray-500 mt-2">
                {stats.map(s => (
                  <div key={s.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}></span>
                    {s.name} <span className="font-medium text-gray-700">({s.value})</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm lg:col-span-2 hover:shadow-md transition-shadow">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="font-semibold text-gray-800">关键指标</h3>
                 <div className="text-3xl font-bold text-gray-900">{filteredTasks.length} <span className="text-sm font-normal text-gray-500">任务总数</span></div>
               </div>
               <div className="h-48">
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={stats} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12, fill: '#4b5563'}} axisLine={false} tickLine={false} />
                      <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                        {stats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                   </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>
          </div>

          {/* Task List */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">任务列表</h3>
              <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">共 {filteredTasks.length} 条</span>
            </div>
            
            {filteredTasks.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredTasks.map(task => {
                  const assignee = MOCK_USERS.find(u => u.id === task.assigneeId);
                  const project = MOCK_PROJECTS.find(p => p.id === task.projectId);
                  
                  return (
                    <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors group flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-shrink-0 mt-1 sm:mt-0">
                        {getStatusIcon(task.status)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">{task.title}</h4>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${getPriorityColor(task.priority)}`}>
                            {getPriorityLabel(task.priority)}
                          </span>
                          {task.parentId && (
                            <span className="text-[10px] bg-gray-100 text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded">子任务</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate mb-2">{task.description}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1.5 text-gray-400">
                             <Calendar size={14} />
                             <span className="text-gray-600">{task.dueDate}</span>
                          </div>
                          {project && (
                            <div className="hidden sm:flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                              <span className="text-gray-600">{project.name}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            {task.tagIds.map(tid => {
                               const tag = MOCK_TAGS.find(t => t.id === tid);
                               if(!tag) return null;
                               return (
                                 <span key={tid} className="flex items-center gap-1 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full text-gray-600">
                                   <TagIcon size={10} /> {tag.name}
                                 </span>
                               )
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:w-48 sm:justify-end">
                         {assignee ? (
                           <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-full border border-gray-100" title={`负责人: ${assignee.name}`}>
                             <img src={assignee.avatar} alt={assignee.name} className="w-6 h-6 rounded-full border border-white shadow-sm" />
                             <span className="text-sm text-gray-700 hidden sm:inline font-medium">{assignee.name}</span>
                           </div>
                         ) : (
                           <span className="text-xs text-gray-400 italic">未分配</span>
                         )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
               <div className="p-12 text-center">
                 <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4 border border-gray-200">
                   <CheckCircle2 className="text-gray-400" size={24} />
                 </div>
                 <h3 className="text-gray-900 font-medium mb-1">暂无任务</h3>
                 <p className="text-gray-500 text-sm">当前上下文下没有找到匹配的任务。</p>
               </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

// Helper components & Functions
const LayoutIcon = ({type}: {type: WorkbenchContext['type']}) => {
    switch(type) {
        case 'project': return <span className="text-white font-bold px-1">P</span>;
        case 'team': return <UserIcon className="text-white" size={20} />;
        case 'task': return <CheckCircle2 className="text-white" size={20} />;
        case 'tag': return <TagIcon className="text-white" size={20} />;
    }
}

const getContextTypeLabel = (type: WorkbenchContext['type']) => {
  switch(type) {
    case 'project': return '项目';
    case 'team': return '团队';
    case 'task': return '任务';
    case 'tag': return '标签';
  }
}

const getPriorityColor = (p: Priority) => {
  switch(p) {
    case Priority.CRITICAL: return 'bg-red-50 text-red-700 border-red-200';
    case Priority.HIGH: return 'bg-orange-50 text-orange-700 border-orange-200';
    case Priority.MEDIUM: return 'bg-blue-50 text-blue-700 border-blue-200';
    case Priority.LOW: return 'bg-gray-100 text-gray-600 border-gray-200';
  }
}

const getPriorityLabel = (p: Priority) => {
  switch(p) {
    case Priority.CRITICAL: return '紧急';
    case Priority.HIGH: return '高';
    case Priority.MEDIUM: return '中';
    case Priority.LOW: return '低';
  }
}

export default Workbench;