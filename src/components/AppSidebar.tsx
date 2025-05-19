import React from 'react';
import { Play, PauseCircle, Download, Upload, Save, Folder, ZoomIn, ZoomOut, MousePointer, Plus } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
const AppSidebar = () => {
  return <Sidebar>
      <SidebarHeader className="p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">BPMN Designer
por JonMartins</h1>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Arquivo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <TooltipProvider>
                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild>
                        <Button variant="ghost" size="icon" className="w-full justify-start">
                          <Plus className="h-4 w-4 mr-2" />
                          <span>Novo</span>
                        </Button>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Criar um novo diagrama</p>
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild>
                        <Button variant="ghost" size="icon" className="w-full justify-start">
                          <Folder className="h-4 w-4 mr-2" />
                          <span>Abrir</span>
                        </Button>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Abrir um diagrama existente</p>
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild>
                        <Button variant="ghost" size="icon" className="w-full justify-start">
                          <Save className="h-4 w-4 mr-2" />
                          <span>Salvar</span>
                        </Button>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Salvar diagrama atual</p>
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild>
                        <Button variant="ghost" size="icon" className="w-full justify-start">
                          <Upload className="h-4 w-4 mr-2" />
                          <span>Importar</span>
                        </Button>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Importar arquivo BPMN</p>
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild>
                        <Button variant="ghost" size="icon" className="w-full justify-start">
                          <Download className="h-4 w-4 mr-2" />
                          <span>Exportar</span>
                        </Button>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Exportar diagrama</p>
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              </TooltipProvider>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Ferramentas</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <TooltipProvider>
                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild>
                        <Button variant="ghost" size="icon" className="w-full justify-start">
                          <MousePointer className="h-4 w-4 mr-2" />
                          <span>Selecionar</span>
                        </Button>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ferramenta de seleção</p>
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild>
                        <Button variant="ghost" size="icon" className="w-full justify-start">
                          <ZoomIn className="h-4 w-4 mr-2" />
                          <span>Ampliar</span>
                        </Button>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Aumentar zoom</p>
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarMenuButton asChild>
                        <Button variant="ghost" size="icon" className="w-full justify-start">
                          <ZoomOut className="h-4 w-4 mr-2" />
                          <span>Reduzir</span>
                        </Button>
                      </SidebarMenuButton>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Diminuir zoom</p>
                    </TooltipContent>
                  </Tooltip>
                </SidebarMenuItem>
              </TooltipProvider>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>;
};
export default AppSidebar;