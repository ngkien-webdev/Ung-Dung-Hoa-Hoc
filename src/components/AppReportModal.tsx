
import React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Beaker, Table, Book, BrainCircuit, Trophy, LayoutDashboard, 
  Languages, Users, Sparkles, RotateCcw, BarChart, Search 
} from 'lucide-react';

interface AppReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AppReportModal: React.FC<AppReportModalProps> = ({
  open,
  onOpenChange
}) => {
  const { t, language } = useLanguage();
  
  const isVietnamese = language === 'vi';
  
  const features = [
    {
      id: 'periodic',
      icon: <Table className="h-5 w-5 text-primary" />,
      title: isVietnamese ? 'Bảng Tuần Hoàn' : 'Periodic Table',
      description: isVietnamese 
        ? 'Khám phá bảng tuần hoàn các nguyên tố tương tác đầy đủ với thông tin chi tiết về mỗi nguyên tố'
        : 'Explore the full interactive periodic table with detailed information about each element'
    },
    {
      id: 'search',
      icon: <Search className="h-5 w-5 text-primary" />,
      title: isVietnamese ? 'Tìm Kiếm Nguyên Tố' : 'Element Search',
      description: isVietnamese
        ? 'Tìm kiếm nguyên tố bằng tên, ký hiệu, hoặc thuộc tính với bộ lọc nâng cao'
        : 'Search for elements by name, symbol, or properties with advanced filters'
    },
    {
      id: 'reactions',
      icon: <Beaker className="h-5 w-5 text-primary" />,
      title: isVietnamese ? 'Mô Phỏng Phản Ứng 3D' : '3D Reaction Simulations',
      description: isVietnamese
        ? 'Trực quan hóa phản ứng hóa học với hiệu ứng 3D, kèm theo khả năng điều chỉnh tốc độ và nhiệt độ'
        : 'Visualize chemical reactions with 3D effects, including speed and temperature adjustments'
    },
    {
      id: 'learning',
      icon: <Book className="h-5 w-5 text-primary" />,
      title: isVietnamese ? 'Nội Dung Học Tập' : 'Learning Content',
      description: isVietnamese
        ? 'Tài liệu học tập về hóa học với các bài giảng, giải thích và hình ảnh minh họa'
        : 'Educational chemistry content with lessons, explanations, and visual aids'
    },
    {
      id: 'quiz',
      icon: <Trophy className="h-5 w-5 text-primary" />,
      title: isVietnamese ? 'Trắc Nghiệm Tương Tác' : 'Interactive Quizzes',
      description: isVietnamese
        ? 'Kiểm tra kiến thức với các câu hỏi trắc nghiệm tương tác về các nguyên tố và phản ứng hóa học'
        : 'Test knowledge with interactive quizzes on elements and chemical reactions'
    },
    {
      id: 'multilingual',
      icon: <Languages className="h-5 w-5 text-primary" />,
      title: isVietnamese ? 'Hỗ Trợ Đa Ngôn Ngữ' : 'Multilingual Support',
      description: isVietnamese
        ? 'Đầy đủ hỗ trợ song ngữ Anh-Việt cho tất cả tính năng và nội dung'
        : 'Full English-Vietnamese bilingual support for all features and content'
    },
    {
      id: 'visualizer',
      icon: <RotateCcw className="h-5 w-5 text-primary" />,
      title: isVietnamese ? 'Mô Hình Nguyên Tử 3D' : '3D Atomic Models',
      description: isVietnamese
        ? 'Khám phá cấu trúc nguyên tử với mô hình 3D tương tác'
        : 'Explore atomic structure with interactive 3D models'
    },
    {
      id: 'analytics',
      icon: <BarChart className="h-5 w-5 text-primary" />,
      title: isVietnamese ? 'Biểu Đồ Dữ Liệu' : 'Data Visualization',
      description: isVietnamese
        ? 'Biểu đồ so sánh các thuộc tính nguyên tố và xu hướng trong bảng tuần hoàn'
        : 'Charts comparing element properties and trends in the periodic table'
    }
  ];
  
  const useCases = [
    {
      title: isVietnamese ? 'Giáo dục' : 'Education',
      icon: <Book className="h-4 w-4" />,
      description: isVietnamese
        ? 'Hỗ trợ học sinh, sinh viên và giáo viên với công cụ trực quan để học về hóa học'
        : 'Support students and teachers with visual tools for learning chemistry'
    },
    {
      title: isVietnamese ? 'Nghiên cứu' : 'Research',
      icon: <BrainCircuit className="h-4 w-4" />,
      description: isVietnamese
        ? 'Cung cấp tham khảo nhanh về các nguyên tố và phản ứng cho các nhà nghiên cứu'
        : 'Provide quick reference about elements and reactions for researchers'
    },
    {
      title: isVietnamese ? 'Công nghiệp' : 'Industry',
      icon: <Beaker className="h-4 w-4" />,
      description: isVietnamese
        ? 'Hỗ trợ các chuyên gia trong lĩnh vực hóa học, vật liệu và sản xuất'
        : 'Support professionals in chemistry, materials, and manufacturing fields'
    }
  ];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {isVietnamese ? 'Báo Cáo Ứng Dụng Hóa Học Tương Tác' : 'Interactive Chemistry App Report'}
          </DialogTitle>
          <DialogDescription>
            {isVietnamese 
              ? 'Tổng quan về các tính năng, vai trò và hiệu suất của ứng dụng học hóa học tương tác'
              : 'An overview of the features, roles and performance of the interactive chemistry learning application'
            }
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 pr-4">
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features">
                <Sparkles className="h-4 w-4 mr-2" />
                {isVietnamese ? 'Tính Năng' : 'Features'}
              </TabsTrigger>
              <TabsTrigger value="role">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                {isVietnamese ? 'Vai Trò' : 'Role'}
              </TabsTrigger>
              <TabsTrigger value="audience">
                <Users className="h-4 w-4 mr-2" />
                {isVietnamese ? 'Đối Tượng' : 'Audience'}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="features" className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map(feature => (
                  <Card key={feature.id} className="overflow-hidden border-l-4 hover:shadow-md transition-shadow" style={{ borderLeftColor: 'var(--element-color-1, hsl(var(--primary)))' }}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {feature.icon}
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="role" className="py-4">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{isVietnamese ? 'Vai Trò Chính' : 'Primary Role'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    {isVietnamese 
                      ? 'Ứng dụng hóa học tương tác này đóng vai trò là một nền tảng giáo dục toàn diện, kết hợp giữa trực quan hóa các khái niệm hóa học và cung cấp thông tin chi tiết về các nguyên tố, phản ứng hóa học, và các nguyên lý cơ bản.'
                      : 'This interactive chemistry application serves as a comprehensive educational platform, combining visualization of chemistry concepts with detailed information about elements, chemical reactions, and fundamental principles.'
                    }
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    {useCases.map((useCase, idx) => (
                      <div key={idx} className="bg-muted p-4 rounded-lg">
                        <div className="flex items-center gap-2 font-medium mb-2">
                          {useCase.icon}
                          {useCase.title}
                        </div>
                        <p className="text-sm text-muted-foreground">{useCase.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{isVietnamese ? 'Tác Động Giáo Dục' : 'Educational Impact'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">
                    {isVietnamese 
                      ? 'Ứng dụng này giúp người dùng:'
                      : 'This application helps users to:'
                    }
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <Badge variant="outline">{isVietnamese ? 'Hiểu biết' : 'Understand'}</Badge>
                      <p className="text-sm">
                        {isVietnamese 
                          ? 'Hiểu rõ các khái niệm hóa học cơ bản thông qua trực quan hóa và mô phỏng 3D'
                          : 'Comprehend basic chemistry concepts through visualization and 3D simulations'
                        }
                      </p>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline">{isVietnamese ? 'Khám phá' : 'Explore'}</Badge>
                      <p className="text-sm">
                        {isVietnamese 
                          ? 'Khám phá các nguyên tố và phản ứng hóa học theo cách tương tác và trực quan'
                          : 'Explore elements and chemical reactions in an interactive and visual way'
                        }
                      </p>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline">{isVietnamese ? 'Học tập' : 'Learn'}</Badge>
                      <p className="text-sm">
                        {isVietnamese 
                          ? 'Học về bảng tuần hoàn, các nhóm nguyên tố, và mối quan hệ giữa các thuộc tính'
                          : 'Learn about the periodic table, element groups, and property relationships'
                        }
                      </p>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="outline">{isVietnamese ? 'Thực hành' : 'Practice'}</Badge>
                      <p className="text-sm">
                        {isVietnamese 
                          ? 'Thực hành kiến thức thông qua các bài kiểm tra và đánh giá tương tác'
                          : 'Practice knowledge through interactive quizzes and assessments'
                        }
                      </p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="audience" className="py-4">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>{isVietnamese ? 'Đối Tượng Mục Tiêu' : 'Target Audience'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{isVietnamese ? 'Người dùng chính' : 'Primary Users'}</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <div className="bg-primary/20 p-2 rounded-full text-primary">
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{isVietnamese ? 'Học sinh và sinh viên' : 'Students'}</p>
                            <p className="text-sm text-muted-foreground">
                              {isVietnamese 
                                ? 'Từ cấp trung học đến đại học, đang học hóa học'
                                : 'From high school to university level, studying chemistry'
                              }
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="bg-primary/20 p-2 rounded-full text-primary">
                            <Book className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{isVietnamese ? 'Giáo viên và giảng viên' : 'Teachers and Educators'}</p>
                            <p className="text-sm text-muted-foreground">
                              {isVietnamese 
                                ? 'Sử dụng trong giảng dạy và minh họa các khái niệm hóa học'
                                : 'Using for teaching and illustrating chemistry concepts'
                              }
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">{isVietnamese ? 'Người dùng thứ cấp' : 'Secondary Users'}</h3>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <div className="bg-primary/20 p-2 rounded-full text-primary">
                            <BrainCircuit className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{isVietnamese ? 'Nhà nghiên cứu' : 'Researchers'}</p>
                            <p className="text-sm text-muted-foreground">
                              {isVietnamese 
                                ? 'Tìm kiếm tham khảo nhanh về các thuộc tính nguyên tố'
                                : 'Looking for quick reference on element properties'
                              }
                            </p>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="bg-primary/20 p-2 rounded-full text-primary">
                            <Beaker className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{isVietnamese ? 'Chuyên gia hóa học' : 'Chemistry Professionals'}</p>
                            <p className="text-sm text-muted-foreground">
                              {isVietnamese 
                                ? 'Trong ngành hóa học, vật liệu và liên quan'
                                : 'In chemistry, materials, and related industries'
                              }
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-muted rounded-lg">
                    <h3 className="text-lg font-medium mb-3">{isVietnamese ? 'Mục tiêu hướng đến' : 'Accessibility Goals'}</h3>
                    <p className="mb-4">
                      {isVietnamese 
                        ? 'Ứng dụng này được thiết kế để:'
                        : 'This application is designed to be:'
                      }
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <Badge className="justify-center py-2">{isVietnamese ? 'Đa ngôn ngữ' : 'Multilingual'}</Badge>
                      <Badge className="justify-center py-2">{isVietnamese ? 'Dễ tiếp cận' : 'Accessible'}</Badge>
                      <Badge className="justify-center py-2">{isVietnamese ? 'Trực quan' : 'Visual'}</Badge>
                      <Badge className="justify-center py-2">{isVietnamese ? 'Tương tác' : 'Interactive'}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
        
        <DialogFooter className="flex-shrink-0 pt-2">
          <Button onClick={() => onOpenChange(false)}>
            {isVietnamese ? 'Đóng báo cáo' : 'Close report'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AppReportModal;
