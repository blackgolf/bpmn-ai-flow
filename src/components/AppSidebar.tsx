
import React from 'react';
import { MousePointer, ZoomIn, ZoomOut } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="p-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">BPMN Designer</h1>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
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
    </Sidebar>
  );
};

export default AppSidebar;
