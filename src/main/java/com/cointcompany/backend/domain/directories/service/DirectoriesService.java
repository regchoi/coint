package com.cointcompany.backend.domain.directories.service;

import com.cointcompany.backend.domain.directories.dto.DirectoriesDto;
import com.cointcompany.backend.domain.directories.entity.Directories;
import com.cointcompany.backend.domain.directories.repository.DirectoriesRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class DirectoriesService {

    private final DirectoriesRepository directoriesRepository;

    @Transactional(readOnly = true)
    public List<DirectoriesDto.GetDirectories> findAllDirectories() {

        List<DirectoriesDto.GetDirectories> getDirectoriesList = new ArrayList<>();
        List<Directories> directoriesList = directoriesRepository.findAll();

        for (Directories directories : directoriesList) {
            DirectoriesDto.GetDirectories getDirectories = new DirectoriesDto.GetDirectories(directories);
            getDirectoriesList.add(getDirectories);
        }

        return getDirectoriesList;
    }

    @Transactional
    public String saveDirectories(DirectoriesDto.PostDirectories postDirectories, Long parentDirectoriesIdNum) {

        Directories directories = Directories.of(
                postDirectories.getDirName(),
                directoriesRepository.findById(parentDirectoriesIdNum).orElseThrow()
        );

        directoriesRepository.save(directories);

        return "SUCCESS";
    }

    @Transactional
    public String modifyDirectories(DirectoriesDto.PostDirectories postDirectories, Long directoriesIdNum) {

        Directories directories = directoriesRepository.findById(directoriesIdNum).orElseThrow();
        directories.setDirName(postDirectories.getDirName());

        return "SUCCESS";

    }

    @Transactional
    public String removeDirectories(Long directoriesIdNum) {

        //삭제하기 전 연결 된 Document 먼저 삭제

        directoriesRepository.deleteById(directoriesIdNum);

        return "SUCCESS";
    }

}
